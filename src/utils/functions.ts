import { TDocument, TGrouped } from '@/types/types';
export function escapeQuotation(str: string) {
	return str.replace(/'/g, "''");
}

export function referenceDocsToString(
	docs: {
		page: number;
		documentName: any;
	}[],
) {
	let result = 'Refered : ';

	// group by documentName
	// const grouped = docs.reduce((groupedDocs : any, doc) => {
	// 	if (!groupedDocs[doc.documentName]) {
	// 		groupedDocs[doc.documentName] = [];
	// 	}
	// 	groupedDocs[doc.documentName].push(doc.page);
	// 	return groupedDocs;
	// },{});
	const grouped: TGrouped = {};
	for (const doc of docs) {
		if (!grouped[doc.documentName]) {
			grouped[doc.documentName] = [] as number[];
		}
		grouped[doc.documentName].push(doc.page);
	}
	// convert to string
	for (const [docName, pages] of Object.entries(grouped)) {
		const sortedPages = pages.sort((a, b) => a - b);
		result += `\n ${docName} (${sortedPages.join(', ')} page)`;
	}

	return result;
}

export function hasSpecialChars(str: string) {
	const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
	return specialChars.test(str);
}
