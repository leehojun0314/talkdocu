import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { Document } from 'langchain/document';
import { Pinecone } from '@pinecone-database/pinecone';
import { TParagraph } from '@/types/types';
function getIndex() {
	const client = new Pinecone({
		apiKey: process.env.PINECONE_API_KEY || '',
		environment: process.env.PINECONE_ENVIRONMENT || '',
	});
	return client.Index(process.env.PINECONE_INDEX || '');
}
export async function upsertParagraph({
	paragraphs,
	convIntId,
	docuId,
}: {
	paragraphs: TParagraph[];
	convIntId: number;
	docuId: number;
}) {
	const batchSize = 100;
	const batches = [];
	for (let i = 0; i < paragraphs.length; i += batchSize) {
		batches.push(paragraphs.slice(i, i + batchSize));
	}
	try {
		for await (const batch of batches) {
			const result = await upsertBatchParagraphs({
				paragraphs: batch,
				convIntId,
				docuId,
			});
			console.log('upserted result: ', result);
		}
	} catch (error) {
		console.log('upsert Error: ', error);
	}
}
async function upsertBatchParagraphs({
	paragraphs,
	convIntId,
	docuId,
}: {
	paragraphs: TParagraph[];
	convIntId: number;
	docuId: number;
}) {
	try {
		const client = new Pinecone({
			apiKey: process.env.PINECONE_API_KEY || '',
			environment: process.env.PINECONE_ENVIRONMENT || '',
		});
		const docs = paragraphs.map((p) => {
			return new Document({
				pageContent: p.content,
				metadata: {
					pageNumber: p.pageNumber,
					convIntId,
					docuInfo: p.docuInfo,
					docuMeta: p.docuMeta,
					docuId,
					docuName: p.docuName,
				},
			});
		});

		const pineconeIndex = client.Index(process.env.PINECONE_INDEX || '');
		const result = await PineconeStore.fromDocuments(
			docs,
			new OpenAIEmbeddings(),
			{ pineconeIndex },
		);
		return result;
	} catch (error) {
		console.log('upsert error: ', error);
		return error;
	}
}
export async function deleteConvPinecone(convIntId: number) {
	const pineconeIndex = getIndex();
	const deleteRes = await pineconeIndex.deleteMany({
		convIntId: Number(convIntId),
	});
	return deleteRes;
}
export async function deleteDocuPinecone(docuId: number) {
	const pineconeIndex = getIndex();
	const deleteRes = await pineconeIndex.deleteMany({
		docuId: Number(docuId),
	});
	console.log('pinecone delete res: ', deleteRes);
	return deleteRes;
}
