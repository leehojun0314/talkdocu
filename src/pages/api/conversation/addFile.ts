// import { NextApiRequest, NextApiResponse } from 'next';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '../auth/[...nextauth]';
// import { useFormidable } from '@/lib/formidable';
import { TParagraph, TUserFromDB } from '@/types/types';
// import  { File } from 'formidable';
// import fs from 'fs';
// import { pageRender } from '@/lib/processFile';
// import PdfParse from 'pdf-parse';
// import { insertParagraphs } from '@/models/paragraph';
// import { upsertParagraph } from '@/models/pinecone';
import { batchCaller } from '@/utils/functions';
import { insertDocument } from '@/models/document';
// import { configs } from '@/config';
// import { getUserInfoFromSession } from '@/models/user';
import { selectConvByStrAuth, updateConvStatus } from '@/models/conversation';
import { getUserInfoEdge } from '@/lib/getUserInfoEdge';
import { prismaEdge } from '@/models';
import { getErrorMessage } from '@/utils/errorMessage';
// export const config = {
// 	api: {
// 		bodyParser: false,
// 	},
// };
export const runtime = 'edge';
export default async function POST(
	request: Request,
	// response: NextApiResponse,
) {
	console.log('add file called');
	// if (request.method !== 'POST') {
	// 	response.status(404).send('Bad request');
	// 	return;
	// }
	// response.setHeader('Content-Type', 'application/json');
	// response.setHeader('X-Accel-Buffering', 'no');

	const user: TUserFromDB = await getUserInfoEdge(request);
	console.log('user: ', user);
	const { convStringId, documents } = await request.json();
	console.log('conv string id : ', convStringId);
	// console.log('documents: ', documents);
	// let fields, files, convStringId, convIntId;

	if (!user) {
		// response.status(401).send('Unauthenticated');
		return new Response('Unauthenticated', { status: 401 });
	}
	if (!convStringId) {
		return new Response('Invalid conversation parameter', { status: 400 });
	}
	if (!documents.length) {
		return new Response('No file is given', { status: 400 });
	}

	try {
		const convIntId = (await selectConvByStrAuth(convStringId, user.user_id))
			.id;
		if (!convIntId) {
			throw new Error('User is not the owner of the conversation.');
		}
		console.log('conv int id: ', convIntId);
		console.log('user: ', user);
		await updateConvStatus(convIntId, 'analyzing', user.user_id);

		//upload blob
		// let fileIndex = 0;
		for (let doc of documents) {
			const insertDocRes = await insertDocument({
				documentName: doc.documentName,
				documentSize: doc.documentSize,
				convIntId,
			});
			const docuId = insertDocRes.document_id;
			const paragraphs: TParagraph[] = [];
			for (let i = 0; i < doc.pages.length; i++) {
				paragraphs.push({
					content: doc.pages[i],
					pageNumber: i + 1,
					convIntId,
					docuId,
					docuName: doc.documentName,
				});
			}
			const batches: TParagraph[][] = [];
			batchCaller(paragraphs, (batchedParagraphs) => {
				batches.push(batchedParagraphs);
			});
			console.log('batches: ', batches);
			const transactionRes = batches.map((batch) => {
				return prismaEdge.$transaction(
					batch.map((paragraph) =>
						prismaEdge.paragraph.create({
							data: {
								document_id: docuId,
								paragraph_content: paragraph.content,
								order_number: paragraph.pageNumber,
								conversation_id: convIntId,
							},
						}),
					),
				);
			});
			const promiseAllRes = await Promise.all(transactionRes);
			console.log('promise all res: ', promiseAllRes);
		}

		await updateConvStatus(convIntId, 'created', user.user_id);
		// response.write(JSON.stringify({ message: 'All files processed' }));
		// response.end();
		// response.status(200).send('add file complete');
		return new Response('add file complete', { status: 200 });
	} catch (error) {
		console.log('add file error: ', error);
		// response.status(500).send(error);
		return new Response(getErrorMessage(error), { status: 500 });
	}
}
// const processFile = async (file: File) => {
// 	try {
// 		const bufferData = await fs.promises.readFile(file.filepath);
// 		const pages: any[] = [];
// 		await PdfParse(bufferData, { pagerender: pageRender(pages) });
// 		const replacedTexts = pages.join('').replaceAll(' ', '');
// 		if (!replacedTexts.length) {
// 			throw new Error(
// 				`Couldn't extract text from the file ${file.originalFilename}`,
// 			);
// 		}
// 	} catch (err) {
// 		console.log('error: ', err);
// 		return { status: true, message: 'error occured' };
// 	}

// 	return { status: false, message: '' };
// };
