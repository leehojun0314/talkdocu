import { configs } from '@/config';
import { Pinecone } from '@pinecone-database/pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { Document } from 'langchain/document';
import { TReferenceDoc } from '@/types/types';

export default async function getRelatedParaPinecone(
	userMessage: string,
	convIntId: number,
) {
	const pineconeClient = new Pinecone({
		apiKey: process.env.PINECONE_API_KEY ?? '',
		environment: process.env.PINECONE_ENVIRONMENT ?? '',
	});
	const pineconeIndex = pineconeClient.Index(process.env.PINECONE_INDEX ?? '');
	const embeddings = new OpenAIEmbeddings();
	const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
		pineconeIndex,
	});
	const messageVector = await embeddings.embedQuery(userMessage);
	const vectorStoreResult = await vectorStore.similaritySearchVectorWithScore(
		messageVector,
		10,
		{
			convIntId: Number(convIntId),
		},
	);
	const filteredStoreResult = vectorStoreResult.filter(
		(storeResult) => storeResult[1] > configs.vectorResultSimilarityScore,
	);
	let relatedParagraphs = filteredStoreResult.map((storeResult) => {
		return storeResult[0];
	});
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
