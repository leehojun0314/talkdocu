import {
	getUserInfoFromSession,
	selectConvByStrAuth,
	updateConvStatus,
} from '@/models';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { useFormidable } from '@/lib/formidable';
import { TParagraph, TUserFromDB } from '@/types/types';
import formidable, { File } from 'formidable';
import fs from 'fs';
import { pageRender } from '@/lib/processFile';
import PdfParse from 'pdf-parse';
import { insertParagraphs } from '@/models/paragraph';
import { upsertParagraph } from '@/models/pinecone';
import { escapeQuotation } from '@/utils/functions';
import { insertDocument } from '@/models/document';
import { configs } from '@/config';
export const config = {
	api: {
		bodyParser: false,
	},
};
export default async function handler(
	request: NextApiRequest,
	response: NextApiResponse,
) {
	if (request.method !== 'POST') {
		response.status(404).send('Bad request');
		return;
	}
	// response.setHeader('Content-Type', 'application/json');
	response.setHeader('X-Accel-Buffering', 'no');

	const user: TUserFromDB = await getUserInfoFromSession(
		await getServerSession(request, response, authOptions),
	);
	let fields, files, convStringId, convIntId;

	if (!user) {
		response.status(401).send('Unauthenticated');
		return;
	}
	try {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const formidableRes = await useFormidable(request);
		fields = formidableRes.fields;
		files = formidableRes.files;
		convStringId = fields.convStringId;
		if (!convStringId) {
			throw new Error('Invalid conversation parameter');
		}
		convIntId = (await selectConvByStrAuth(convStringId, user.user_id))
			.recordset[0].id;
		if (!convIntId) {
			throw new Error('User is not the owner of the conversation.');
		}
		let fileCount = 0;
		for (let file in files) {
			fileCount++;
		}
		if (!fileCount) {
			throw new Error('No file is given');
		}
	} catch (error) {
		console.log('error: ', error);
		response.status(500).send(error);
	}
	try {
		await updateConvStatus(convIntId, 'analyzing', user.user_id);
		let isError = { status: false, message: '' };
		if (!files) {
			throw new Error('No file is given');
		}
		for (let file of Object.values(files)) {
			if (file instanceof File) {
				isError = await processFile(file[0]);
				if (isError.status) break;
			}
		}
		if (isError.status) {
			throw new Error(isError.message);
		}

		//upload blob
		// let uploadResults = await uploadBlob_v2(files);
		console.log('uploaded files: ', files);
		let fileIndex = 0;
		for await (let file of Object.values(files)) {
			// const { fileUrl, buffer, originalFilename, fileSize } = uploadResult;
			if (!file) {
				break;
			}
			const fileUrl = '';
			const buffer = await fs.promises.readFile(file[0].filepath);
			const originalFilename = file[0].originalFilename ?? '';
			const fileSize = file[0].size;
			let stringBeforeSent =
				JSON.stringify({
					message: `Uploading file: ${originalFilename}`,
					status: 'uploading',
					progress: `${Math.floor(
						(fileIndex / Object.values(files).length) * 100,
					)}`,
				}) + '#';
			console.log('string before sent: ', stringBeforeSent);
			response.write(stringBeforeSent);
			//insert document in mssql
			const insertDocumentResult = await insertDocument({
				documentName: originalFilename,
				documentUrl: fileUrl,
				documentSize: fileSize,
				convIntId,
			});
			const documentId = insertDocumentResult.recordset[0].document_id;
			console.log('documentid : ', documentId);
			const pages: any[] = [];
			const document = await PdfParse(buffer, {
				pagerender: pageRender(pages),
			});
			const paragraphs: TParagraph[] = [];
			for (let i = 0; i < pages.length; i++) {
				paragraphs.push({
					content:
						`(page : ${i + 1})` + escapeQuotation(pages[i]).toLowerCase(),
					// keywords: escapeQuotation(extracted[i].join(', ')),
					pageNumber: i + 1,
					convIntId,
					docuInfo: document.info,
					docuMeta: document.metadata,
					docuId: documentId,
					docuName: originalFilename ?? '',
				});
			}
			await upsertParagraph({
				paragraphs,
				convIntId,
				docuId: documentId,
			});
			await insertParagraphs({ paragraphs, convIntId, documentId });
			// Send progress update to client

			fileIndex++;
		}
		await updateConvStatus(convIntId, 'created', user.user_id);
		response.write(JSON.stringify({ message: 'All files processed' }));
		response.end();
	} catch (error) {
		console.log('error: ', error);
		response.status(500).send(error);
	}
}
const processFile = async (file: File) => {
	try {
		const bufferData = await fs.promises.readFile(file.filepath);
		const pages: any[] = [];
		await PdfParse(bufferData, { pagerender: pageRender(pages) });
		const replacedTexts = pages.join('').replaceAll(' ', '');
		if (!replacedTexts.length) {
			throw new Error(
				`Couldn't extract text from the file ${file.originalFilename}`,
			);
		}
	} catch (err) {
		console.log('error: ', err);
		return { status: true, message: 'error occured' };
	}

	return { status: false, message: '' };
};
