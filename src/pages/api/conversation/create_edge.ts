import { getErrorMessage } from '@/utils/errorMessage';
import { getUserInfoEdge } from '@/lib/getUserInfoEdge';
import { PrismaClient } from '@prisma/client/edge';
import { insertConv } from '@/models/conversation';
import { generateConvId } from '@/lib/generateConvId';
import { insertDocument } from '@/models/document';
import { TParagraph } from '@/types/types';
import { insertParagraphs } from '@/models/paragraph';
import { batchCaller } from '@/utils/functions';
// import { withAccelerate } from '@prisma/extension-accelerate';
export const runtime = 'edge';
export default async function POST(req: Request) {
	try {
		const user = await getUserInfoEdge(req);
		console.log('user: ', user);
		const prisma = new PrismaClient();
		const userFromDB = await prisma.userTable.findFirstOrThrow({
			where: {
				user_email: user.email as string,
				auth_type: user.provider as string,
			},
		});
		console.log('user from db: ', userFromDB);
		const { documents, conversationName } = await req.json();
		console.log('documents: ', documents);
		console.log('conversation name: ', conversationName);
		const insertConvRes = await insertConv({
			conversationName,
			userId: userFromDB.user_id,
			convStringId: generateConvId(),
		});
		console.log('insert Conv Res: ', insertConvRes);
		const convIntId = insertConvRes.id;
		for (let doc of documents) {
			// const insertDocRes = await insertDocument({
			// 	documentName: doc.documentName,
			// 	documentSize: doc.documentSize,
			// 	convIntId,
			// });
			const insertDocRes = await prisma.document.create({
				data: {
					document_name: doc.documentName,
					document_size: doc.documentSize,
					conversation_id: convIntId,
				},
			});
			const documentId = insertDocRes.document_id;
			const paragraphs: TParagraph[] = [];
			for (let i = 0; i < doc.pages.length; i++) {
				paragraphs.push({
					content: doc.pages[i],
					pageNumber: i + 1,
					convIntId,
					docuId: documentId,
					docuName: doc.documentName,
				});
			}
			// await upsertParagraph
			const batches: TParagraph[][] = [];
			batchCaller(paragraphs, (batchedParagraphs) => {
				batches.push(batchedParagraphs);
			});
			const transactionRes = batches.map((batch) => {
				return prisma.$transaction(
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
			});
			const promiseAllRes = await Promise.all(transactionRes);
			console.log('promise all res: ', promiseAllRes);
			// const insertParaRes = await insertParagraphs({
			// 	paragraphs,
			// 	convIntId,
			// 	documentId,
			// });
			// console.log('insert para res: ', insertParaRes);
		}

		return new Response('created');
	} catch (error) {
		console.log('error: ', error);
		return new Response(getErrorMessage(error), { status: 500 });
	}
}
