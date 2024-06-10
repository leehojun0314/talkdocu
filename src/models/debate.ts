import { TSender } from '@/types/types';
import { prismaEdge } from '.';

export async function insertDebate(
	questionId: number,
	answerId: number,
	referContent: string,
	convIntId: number,
	userId: number,
) {
	return await prismaEdge.debate.create({
		data: {
			question_id: questionId,
			answer_id: answerId,
			refer_content: referContent,
			conversation_id: convIntId,
			user_id: userId,
		},
	});
}

export async function insertDebateMessage(
	content: string,
	sender: TSender,
	debateId: number,
	convIntId: number,
	userId: number,
) {
	return await prismaEdge.debate_Message.create({
		data: {
			content: content,
			sender: sender,
			debate_id: debateId,
			conversation_id: convIntId,
			user_id: userId,
			time: new Date(),
		},
	});
}
export async function selectDebate(answerId: number, userId: number) {
	return await prismaEdge.debate.findFirstOrThrow({
		where: {
			answer_id: answerId,
			user_id: userId,
		},
		select: {
			debate_id: true,
			question_id: true,
			answer_id: true,
			refer_content: true,
			question: {
				select: {
					message: true,
				},
			},
			answer: {
				select: {
					message: true,
				},
			},
		},
	});
}

export async function selectDebateById(debateId: number) {
	return await prismaEdge.debate.findUnique({
		where: {
			debate_id: debateId,
		},
	});
}

export async function selectDebateMessages(debateId: number, userId: number) {
	return await prismaEdge.debate_Message.findMany({
		where: {
			debate_id: debateId,
			user_id: userId,
		},
		orderBy: {
			id: 'asc',
		},
	});
}
// export async function selectDebate(answerId: number, userId: number) {
// 	return (await sqlConnectionPool.connect())
// 		.request()
// 		.input('answer_id', answerId)
// 		.input('user_id', userId).query(`
// 	SELECT
// 		D.debate_id,
// 		D.question_id,
// 		D.answer_id,
// 		D.refer_content,
// 		QM.message AS question_content,
// 		AM.message AS answer_content
// 	FROM
// 		Debate D
// 	LEFT JOIN
// 		Message QM ON D.question_id = QM.message_id
// 	LEFT JOIN
// 		Message AM ON D.answer_id = AM.message_id
// 	WHERE
// 		D.answer_id = @answer_id AND D.user_id = @user_id;`);
// }
// export async function selectDebateById(debateId: number) {
// 	return (await sqlConnectionPool.connect())
// 		.request()
// 		.input('debate_id', debateId).query(`
// 	SELECT * FROM Debate WHERE debate_id = @debate_id`);
// }
// export async function selectDebateMessages(debateId: number, userId: number) {
// 	return (await sqlConnectionPool.connect())
// 		.request()
// 		.query(
// 			`SELECT * FROM Debate_Message WHERE debate_id = ${debateId} AND user_id = ${userId} ORDER BY id ASC`,
// 		);
// }
