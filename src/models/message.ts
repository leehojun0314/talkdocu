// import { TSender } from '@/types/types';
// import { sqlConnectionPool } from '.';

// export async function insertQuestion(
// 	convIntId: number,
// 	questionsStr: string,
// 	userId: number,
// 	documentName: string,
// ) {
// 	return (await sqlConnectionPool.connect())
// 		.request()
// 		.input('message', questionsStr)
// 		.input('conversation_id', convIntId)
// 		.input('user_id', userId)
// 		.input('document_name', documentName)
// 		.query(`INSERT INTO Message (message, conversation_id, user_id, is_question, sender, created_time, question_doc_name)
//                     VALUES (@message, @conversation_id, @user_id, 1, 'assistant', GETDATE(), @document_name)
//                     `);
// }
// export async function insertMessage(
// 	message: string,
// 	convIntId: number,
// 	sender: TSender,
// 	userId: number,
// ) {
// 	return (await sqlConnectionPool.connect())
// 		.request()
// 		.input('message', message)
// 		.input('convIntId', convIntId)
// 		.input('sender', sender)
// 		.input('user_id', userId)
// 		.query(`INSERT INTO Message (message, conversation_id, sender, user_id, is_question, created_time) OUTPUT INSERTED.message_id
// 	VALUES (@message, @convIntId, @sender, @user_id, 0, GETDATE())`);
// }

// export async function selectMessages(convIntId: number, userId: number) {
// 	return (await sqlConnectionPool.connect())
// 		.request()
// 		.query(
// 			`SELECT * FROM Message WHERE conversation_id = '${convIntId}' AND user_id = ${userId} ORDER BY message_order ASC`,
// 		);
// }
import { PrismaClient, Sender } from '@prisma/client';
const prisma = new PrismaClient();

export async function insertQuestion(
	convIntId: number,
	questionsStr: string,
	userId: number,
	documentName: string,
) {
	return await prisma.message.create({
		data: {
			message: questionsStr,
			conversation_id: convIntId,
			user_id: userId,
			is_question: true,
			sender: 'assistant',
			created_time: new Date(),
			question_doc_name: documentName,
		},
	});
}

export async function insertMessage(
	message: string,
	convIntId: number,
	sender: Sender,
	userId: number,
) {
	return await prisma.message.create({
		data: {
			message: message,
			conversation_id: convIntId,
			sender: sender,
			user_id: userId,
			is_question: false,
			created_time: new Date(),
		},
	});
}

export async function selectMessages(convIntId: number, userId: number) {
	return await prisma.message.findMany({
		where: {
			conversation_id: convIntId,
			user_id: userId,
		},
	});
}
