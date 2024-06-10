'use client';

import { getDocument } from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.entry';
export const extractTextFromFile = (file: File): Promise<string[]> => {
	return new Promise<string[]>((resolve, reject) => {
		const fileReader = new FileReader();
		fileReader.onload = async function (this) {
			try {
				const typedArray = new Uint8Array(this.result as ArrayBuffer);
				const pdf = await getDocument({ data: typedArray }).promise;
				const textPages: string[] = [];

				for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
					const page = await pdf.getPage(pageNum);
					const textContent = await page.getTextContent();
					const pageText = textContent.items
						.map((item) => {
							if ('str' in item) {
								return item.str;
							}
							return '';
						})
						.join(' ');
					textPages.push(`Page ${pageNum}: ${pageText}`);
				}

				resolve(textPages);
			} catch (error) {
				reject(error);
			}
		};

		fileReader.onerror = (error) => {
			reject(error);
		};

		fileReader.readAsArrayBuffer(file);
	});
};
