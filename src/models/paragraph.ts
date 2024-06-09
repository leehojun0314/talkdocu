// import { TParagraph } from '@/types/types';
// import { sqlConnectionPool } from '.';

// export async function selectParagraphDocu(docuId: number, convIntId: number) {
// 	return (await sqlConnectionPool.connect()).request()
// 		.query`SELECT * FROM Paragraph WHERE conversation_id = ${convIntId} AND document_id = ${docuId}`;
// }
// export async function selectParagraphConv(convIntId: number) {
// 	return (await sqlConnectionPool.connect())
// 		.request()
// 		.query(`SELECT * FROM Paragraph WHERE conversation_id = ${convIntId}`);
// }
// export async function insertParagraphs({
// 	paragraphs,
// 	convIntId,
// 	documentId,
// }: {
// 	paragraphs: TParagraph[];
// 	convIntId: number;
// 	documentId: number;
// }) {
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
// async function insertBatchParagraphs(
// 	batch: TParagraph[],
// 	documentId: number,
// 	convIntId: number,
// ) {
// 	const values = batch
// 		.map(
// 			(p) =>
// 				`(${documentId}, N'${p.content}', ${p.pageNumber}, ${convIntId})`,
// 		)
// 		.join(', ');

// 	const query = `INSERT INTO Paragraph (document_id, paragraph_content, order_number, conversation_id) VALUES ${values}`;
// 	const result = (await sqlConnectionPool.connect()).request().query(query);
// 	return result;
// }
import { TParagraph } from '@/types/types';
import { PrismaClient } from '@prisma/client/edge';

export async function selectParagraphDocu(docuId: number, convIntId: number) {
	const prisma = new PrismaClient();

	return await prisma.paragraph.findMany({
		where: {
			conversation_id: convIntId,
			document_id: docuId,
		},
	});
}

export async function selectParagraphConv(convIntId: number) {
	const prisma = new PrismaClient();

	return await prisma.paragraph.findMany({
		where: {
			conversation_id: convIntId,
		},
	});
}

export async function insertParagraphs({
	paragraphs,
	convIntId,
	documentId,
}: {
	paragraphs: TParagraph[];
	convIntId: number;
	documentId: number;
}) {
	const prisma = new PrismaClient();

	const batchSize = 500; // Batch size remains to manage load on the database
	for (let i = 0; i < paragraphs.length; i += batchSize) {
		const batch = paragraphs.slice(i, i + batchSize);
		await prisma.$transaction(
			batch.map((paragraph) =>
				prisma.paragraph.create({
					data: {
						document_id: documentId,
						paragraph_content: paragraph.content,
						order_number: paragraph.pageNumber,
						conversation_id: convIntId,
					},
				}),
			),
		);
	}
}
