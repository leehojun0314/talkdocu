import { sqlConnectionPool } from '.';

export async function insertQuestion(
	convIntId: number,
	questionsStr: string,
	userId: number,
	documentName: string,
) {
	return (await sqlConnectionPool.connect())
		.request()
		.input('message', questionsStr)
		.input('conversation_id', convIntId)
		.input('user_id', userId)
		.input('document_name', documentName)
		.query(`INSERT INTO Message (message, conversation_id, user_id, is_question, sender, created_time, question_doc_name) 
                    VALUES (@message, @conversation_id, @user_id, 1, 'assistant', GETDATE(), @document_name)
                    `);
}
