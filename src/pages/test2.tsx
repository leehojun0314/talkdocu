import React from 'react';
import { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
import 'pdfjs-dist/build/pdf.worker.mjs';
const PdfTextExtractor = () => {
	const [text, setText] = useState<string>('');
	const handleFileChange = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = event.target.files?.[0];
		if (file) {
			const fileReader = new FileReader();
			fileReader.onload = async () => {
				const typedArray = new Uint8Array(fileReader.result as ArrayBuffer);
				const pdf = await pdfjsLib.getDocument(typedArray).promise;
				const textPromises: Promise<any>[] = [];
				for (let i = 1; i <= pdf.numPages; i++) {
					const page = await pdf.getPage(i);
					const textContent = await page.getTextContent();
					const pageText = textContent.items
						.map((item: any) => {
							if ('str' in item) {
								return item.str;
							}
							return '';
						})
						.join(' ');
					textPromises.push(Promise.resolve(pageText));
				}
				const allText = await Promise.all(textPromises);
				setText(allText.join('\n'));
			};
			fileReader.readAsArrayBuffer(file);
		}
	};

	return (
		<div>
			<input type='file' onChange={handleFileChange} />
			<pre>{text}</pre>
		</div>
	);
};
export default function Test2Page() {
	return (
		<div>
			<PdfTextExtractor />
		</div>
	);
}
