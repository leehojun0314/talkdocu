import { configs } from '@/config';
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { CloseVectorNode } from 'langchain/vectorstores/closevector/node';
import { Document } from 'langchain/document';
import { TDocument, TParagraph_DB, TReferenceDoc } from '@/types/types';

export default async function getRelatedParaClosevector(
	userMessage: string,
	paragraphs: TParagraph_DB[],
	documents: TDocument[],
) {
	const transformedDocuments: { [key: number]: string } = documents.reduce(
		(acc: { [key: number]: string }, doc) => {
			acc[doc.document_id] = doc.document_name as string;
			return acc;
		},
		{},
	);
	const docs = paragraphs.map((p) => {
		return new Document({
			pageContent: p.paragraph_content,
			metadata: {
				pageNumber: p.order_number,
				docuId: p.document_id,
				docuName: transformedDocuments[p.document_id],
			},
		});
	});

	const embeddings = new OpenAIEmbeddings({
		openAIApiKey: process.env.OPENAI_API_KEY,
	});
	const vectorStore = await CloseVectorNode.fromDocuments(docs, embeddings);
	const messageVector = await embeddings.embedQuery(userMessage);
	const vectorStoreResult = await vectorStore.similaritySearchVectorWithScore(
		messageVector,
		10,
	);
	//score가 낮은게 높은 관련성이 있는걸로 바뀜
	const filteredStoreResult = vectorStoreResult.filter(
		(storeResult) => storeResult[1] < configs.closeVectorSimilarityScore,
	);
	let relatedParagraphs = filteredStoreResult.map((storeResult) => {
		return storeResult[0];
	});
	//관련성이 너무 없다면 위의 두개를 가져온다.
	if (relatedParagraphs.length === 0) {
		relatedParagraphs = vectorStoreResult.map((storeResult) => {
			return storeResult[0];
		});
		relatedParagraphs.splice(2);
	}
	const selectedParagraphs: Document[] = [];
	let totalLength = 0;
	const maxLength = configs.relatedParagraphLength;
	for (const paragraph of relatedParagraphs) {
		if (totalLength + paragraph.pageContent.length <= maxLength) {
			selectedParagraphs.push(paragraph);
			totalLength += paragraph.pageContent.length;
		} else {
			// 남은 길이를 계산하고, 해당 길이만큼 잘라낸 paragraph_content를 저장합니다.
			const remainingLength = maxLength - totalLength;
			const truncatedContent = paragraph.pageContent.substring(
				0,
				remainingLength,
			);
			selectedParagraphs.push({
				...paragraph,
				pageContent: truncatedContent,
			});
			totalLength += truncatedContent.length;
			break;
		}
	}
	const relatedContent = selectedParagraphs
		.map((p) => p.pageContent)
		.join('\n');
	const referenceDocs: TReferenceDoc[] = selectedParagraphs.map((p) => {
		return {
			page: p.metadata.pageNumber,
			documentName: p.metadata.docuName,
		};
	});
	return { relatedContent, referenceDocs };
}
