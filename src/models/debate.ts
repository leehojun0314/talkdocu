import { TSender } from '@/types/types';
import { sqlConnectionPool } from '.';
export async function insertDebate(
	questionId: number,
	answerId: number,
	referContent: string,
	convIntId: number,
	userId: number,
) {
	return (await sqlConnectionPool.connect())
		.request()
		.input('question_id', questionId)
		.input('answer_id', answerId)
		.input('refer_content', referContent)
		.input('conversation_id', convIntId)
		.input('user_id', userId)
		.query(
			`INSERT INTO Debate (question_id, answer_id, refer_content, conversation_id, user_id) 
						VALUES (@question_id, @answer_id, @refer_content, @conversation_id, @user_id)`,
		);
}
export async function insertDebateMessage(
	content: string,
	sender: TSender,
	debateId: number,
	convIntId: number,
	userId: number,
) {
	return (await sqlConnectionPool.connect())
		.request()
		.input('content', content)
		.input('sender', sender)
		.input('debate_id', debateId)
		.input('conversation_id', convIntId)
		.input('user_id', userId)
		.query(
			`INSERT INTO Debate_Message (content, sender, debate_id, conversation_id, user_id, time) 
						VALUES (@content, @sender, @debate_id, @conversation_id, @user_id, GETDATE())`,
		);
}
