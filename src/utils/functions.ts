import { TDocument, TGrouped } from '@/types/types';

// import {v4 : uuidv4} from 'uuid'
const { v4: uuidv4 } = require('uuid');
export function generateConvId() {
	const currentTime = Date.now();
	const uniqueId = uuidv4();
	return `${uniqueId}-${currentTime}`;
}

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
import { encode } from 'gpt-3-encoder';
import { ChatCompletionMessageParam } from 'openai/resources';
function calculateTokens(str: string) {
	const encoded = encode(str);
	let tokenCount = 0;
	for (let token of encoded) {
		tokenCount++;
	}
	return tokenCount;
}
export function optimizingPrompt(
	prompts: Array<any>,
	exclusives: string,
	tokenLimit: number,
): Array<ChatCompletionMessageParam> {
	let totalTokenCount = 0;
	let exclusiveToken = calculateTokens(exclusives);
	const copiedPrompts = JSON.parse(JSON.stringify(prompts));
	if (copiedPrompts.length) {
		for (let prompt of copiedPrompts) {
			const content = prompt.content;
			totalTokenCount += calculateTokens(content);
		}
	}

	while (totalTokenCount > tokenLimit - exclusiveToken) {
		const item = copiedPrompts.shift();
		if (item?.content) {
			totalTokenCount -= calculateTokens(item.content);
		} else {
			break;
		}
	}

	return copiedPrompts;
}
