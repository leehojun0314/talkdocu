import { PrismaClient } from '@prisma/client/edge';

export async function insertDocument({
	documentName,
	documentSize,
	convIntId,
}: {
	documentName: string;
	documentSize: number;
	convIntId: number;
}) {
	const prisma = new PrismaClient();
	return await prisma.document.create({
		data: {
			document_name: documentName,
			document_size: BigInt(documentSize),
			conversation_id: convIntId,
		},
	});
}
// export async function selectDocuments(convIntId: number) {
// 	return (await sqlConnectionPool.connect())
// 		.request()
// 		.query(`SELECT * FROM Document WHERE conversation_id = '${convIntId}'`);
// }

export async function selectDocuments(convIntId: number) {
	const prisma = new PrismaClient();
	return await prisma.document.findMany({
		where: {
			conversation_id: convIntId,
		},
	});
}
export async function selectDocument(docuId: number, convIntId: number) {
	const prisma = new PrismaClient();
	return await prisma.document.findFirstOrThrow({
		where: {
			document_id: docuId,
			conversation_id: convIntId,
		},
	});
}

export async function deleteDocument(docuId: number, convIntId: number) {
	const prisma = new PrismaClient();
	await prisma.$transaction(async (prisma) => {
		await prisma.paragraph.deleteMany({
			where: {
				document_id: docuId,
				conversation_id: convIntId,
			},
		});
		await prisma.document.deleteMany({
			where: {
				document_id: docuId,
				conversation_id: convIntId,
			},
		});
	});
}
