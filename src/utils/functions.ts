// import {v4 : uuidv4} from 'uuid'
const { v4: uuidv4 } = require('uuid');
import formidable from 'formidable';
import { NextApiRequest } from 'next';
import fs from 'fs';
import PdfParse from 'pdf-parse';
// const PdfParse = require('pdf-parse')
export function generateConvId() {
	const currentTime = Date.now();
	const uniqueId = uuidv4();
	return `${uniqueId}-${currentTime}`;
}

export function useFormidable(req: NextApiRequest): Promise<{
	fields: { conversationName?: string | undefined };
	files: formidable.Files;
}> {
	const form = formidable();
	return new Promise((resolve, reject) => {
		form.parse(req, (err, fields, files) => {
			if (err) {
				console.log('formidable err: ', err);
				reject(err);
			} else {
				resolve({ fields, files });
			}
		});
	});
}
export async function processFile(
	file: any,
): Promise<{ status: boolean; message: string }> {
	try {
		const bufferData = await fs.promises.readFile(file.filepath);
		const pages: string[] = [];
		await PdfParse(bufferData, { pagerender: pageRender(pages) });
		const replacedTexts = pages.join('').replaceAll(' ', '');
		if (!replacedTexts.length) {
			throw new Error(
				`Couldn't extract text from the file ${file.originalFilename}`,
			);
		}
		return { status: false, message: '' };
	} catch (error: any & { message: string }) {
		return { status: true, message: error.message };
	}
}
export function pageRender(pageArr: string[]) {
	return (pageData: any) => {
		let renderOptions = {
			normalizeWhitespace: true,
		};

		return pageData.getTextContent(renderOptions).then((textContent: any) => {
			const mappedText = textContent.items
				.map((item: any) => item.str)
				.join(' ');
			pageArr.push(mappedText);
			return mappedText;
		});
	};
}
export function escapeQuotation(str: string) {
	return str.replace(/'/g, "''");
}
// async function insertParagraphs_v2({ paragraphs, documentId, convIntId }) {
// 	const batchSize = 500;
// 	const batches = [];

// 	for (let i = 0; i < paragraphs.length; i += batchSize) {
// 		batches.push(paragraphs.slice(i, i + batchSize));
// 	}

// 	try {
// 		for (const batch of batches) {
// 			await insertBatchParagraphs(batch, documentId, convIntId);
// 		}
// 	} catch (error) {
// 		console.error('Error inserting paragraphs:', error);
// 	}
// }

export default async function batchFunction<T>(
	batchSize: number,
	elements: any[],
	params: any,
	callback: (
		batch: any[],
		params: any,
	) => void | ((batch: any[], params: any) => Promise<T>),
) {
	const batches: typeof elements = [];
	for (let i = 0; i < elements.length; i += batchSize) {
		batches.push(elements.slice(i, i + batchSize));
	}
	try {
		for (const batch of batches) {
			await callback(batch, params);
		}
	} catch (error) {
		console.log(error);
		throw new Error('batch error');
	}
}
