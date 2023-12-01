import PdfParse from 'pdf-parse';
import fs from 'fs';
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
