'use client';

import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
import 'pdfjs-dist/build/pdf.worker.mjs';
// pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.js`;
export const extractTextFromFile: (file: File) => Promise<string[]> = (
	file: File,
) => {
	return new Promise((resolve, reject) => {
		const fileReader = new FileReader();
		fileReader.onload = async function () {
			try {
				const typedArray = new Uint8Array(this.result as ArrayBuffer);
				const pdf = await pdfjsLib.getDocument({ data: typedArray })
					.promise;
				const textPages: string[] = [];

				for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
					const page = await pdf.getPage(pageNum);
					const textContent = await page.getTextContent();
					const pageText = textContent.items
						.map((item: any) => {
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
				console.log('error: ', error);
				reject([]);
			}
		};

		fileReader.onerror = (error) => {
			console.log('error: ', error);
			reject([]);
		};

		fileReader.readAsArrayBuffer(file);
	});
};
