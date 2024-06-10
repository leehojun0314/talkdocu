import { prismaEdge } from '.';

export async function insertDocument({
	documentName,
	documentSize,
	convIntId,
}: {
	documentName: string;
	documentSize: number;
	convIntId: number;
}) {
	return await prismaEdge.document.create({
		data: {
			document_name: documentName,
			document_size: documentSize,
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
	return await prismaEdge.document.findMany({
		where: {
			conversation_id: convIntId,
		},
	});
}
export async function selectDocument(docuId: number, convIntId: number) {
	return await prismaEdge.document.findFirstOrThrow({
		where: {
			document_id: docuId,
			conversation_id: convIntId,
		},
	});
}

export async function deleteDocument(docuId: number, convIntId: number) {
	await prismaEdge.$transaction(async (prisma) => {
		await prismaEdge.paragraph.deleteMany({
			where: {
				document_id: docuId,
				conversation_id: convIntId,
			},
		});
		await prismaEdge.document.deleteMany({
			where: {
				document_id: docuId,
				conversation_id: convIntId,
			},
		});
	});
}
