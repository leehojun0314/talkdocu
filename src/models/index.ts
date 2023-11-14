import { configs } from '@/config';
import {
	TExtendedSession,
	TParagraph,
	TProvider,
	TStatus,
	TUserFromDB,
} from '@/types';
import mssql from 'mssql';
const sqlConnectionPool = new mssql.ConnectionPool({
	user: process.env.DB_USER ?? '',
	password: process.env.DB_PWD ?? '',
	database: process.env.DB_NAME ?? '',
	server: process.env.DB_HOST ?? '',
	options: {
		encrypt: false,
	},
	pool: {
		max: 10,
		min: 0,
		idleTimeoutMillis: 30000,
	},
});
export async function selectUser(userEmail: string, provider?: TProvider) {
	return (await sqlConnectionPool.connect())
		.request()
		.query(
			`SELECT * FROM UserTable WHERE user_email = '${userEmail}' AND auth_type = '${provider}'`,
		);
}
export async function getUserInfoFromSession(session: TExtendedSession) {
	const { recordset } = await selectUser(
		session?.user?.email ?? '',
		session?.provider,
	);
	if (recordset[0] === null || !recordset[0].user_id) {
		throw new Error('Invalid user');
	}
	return recordset[0];
}
export async function insertConv({
	conversationName,
	userId,
	convStringId,
}: {
	conversationName: string;
	userId: number;
	convStringId: string;
}) {
	return (await sqlConnectionPool.connect())
		.request()
		.input('conversation_name', conversationName)
		.input('user_id', userId)
		.input('conversation_id', convStringId)
		.input('salutation', configs.salutationPrefixMessage)
		.query(`INSERT INTO Conversation (conversation_name, user_id, created_at, status, conversation_id, salutation, visibility) 
        OUTPUT INSERTED.id VALUES (@conversation_name, @user_id, GETDATE(), 'analyzing', @conversation_id, @salutation, 0)`);
}
export async function updateConvStatus(
	convIntId: number,
	status: TStatus,
	userId: number,
) {
	return (await sqlConnectionPool.connect())
		.request()
		.input('convIntId', convIntId)
		.input('status', status)
		.input('user_id', userId).query(`
UPDATE Conversation SET status = @status WHERE id = @convIntId AND user_id = @user_id`);
}
export async function insertDocument({
	documentName,
	documentUrl,
	documentSize,
	convIntId,
}: {
	documentName: string;
	documentUrl: string;
	documentSize: number;
	convIntId: number;
}) {
	return (await sqlConnectionPool.connect())
		.request()
		.input('document_name', documentName)
		.input('document_url', documentUrl)
		.input('document_size', documentSize)
		.input('conversation_id', convIntId)
		.query(
			`INSERT INTO Document (document_name, document_url, document_size, conversation_id) 
						OUTPUT INSERTED.document_id VALUES (@document_name, @document_url, @document_size, @conversation_id)`,
		);
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
	const batchSize = 500;
	const batches = [];

	for (let i = 0; i < paragraphs.length; i += batchSize) {
		batches.push(paragraphs.slice(i, i + batchSize));
	}

	try {
		for (const batch of batches) {
			await insertBatchParagraphs(batch, documentId, convIntId);
		}
	} catch (error) {
		console.error('Error inserting paragraphs:', error);
	}
}
async function insertBatchParagraphs(
	batch: TParagraph[],
	documentId: number,
	convIntId: number,
) {
	const values = batch
		.map(
			(p) =>
				`(${documentId}, N'${p.content}', ${p.pageNumber}, ${convIntId})`,
		)
		.join(', ');

	const query = `INSERT INTO Paragraph (document_id, paragraph_content, order_number, conversation_id) VALUES ${values}`;
	const result = (await sqlConnectionPool.connect()).request().query(query);
	return result;
}

export async function selectConversations(user: TUserFromDB) {
	return (await sqlConnectionPool.connect())
		.request()
		.input('user_id', user.user_id)
		.query(
			`SELECT * FROM Conversation WHERE user_id = '${user.user_id}' AND status <> 'deleted'`,
		);
}
export async function selectConvByStr(convStringId: string) {
	return (await sqlConnectionPool.connect())
		.request()
		.query(
			`SELECT * FROM Conversation WHERE conversation_id = '${convStringId}'`,
		);
}
export async function selectConvByStrAuth(
	convStringId: string,
	userId: number,
) {
	return (await sqlConnectionPool.connect()).request().query(`
	SELECT * FROM Conversation WHERE conversation_id = '${convStringId}' AND user_id = ${userId}`);
}
export async function selectDocuments(convIntId: number) {
	return (await sqlConnectionPool.connect())
		.request()
		.query(`SELECT * FROM Document WHERE conversation_id = '${convIntId}'`);
}
export async function deleteConversationModel(
	convIntId: number,
	userId: number,
) {
	const transaction = sqlConnectionPool.transaction();
	await transaction.begin();

	//get user id of the conversation
	const { recordset } = await transaction
		.request()
		.input('conversation_id', convIntId)
		.query(`SELECT user_id FROM Conversation WHERE id=@conversation_id;`);

	// If the conversation doesn't exist or the user_id doesn't match, throw an error
	if (recordset.length === 0 || recordset[0].user_id !== userId) {
		throw new Error(
			'User does not have permission to delete this conversation',
		);
	}

	// Delete Conversation
	await transaction.request().input('conversation_id', convIntId).query(`
			DELETE FROM Debate_Message WHERE conversation_id=@conversation_id;
			DELETE FROM Debate WHERE conversation_id=@conversation_id;
			DELETE FROM Message WHERE conversation_id=@conversation_id;
			DELETE FROM Paragraph WHERE conversation_id=@conversation_id;
			DELETE FROM Document WHERE conversation_id=@conversation_id;
			DELETE FROM Question WHERE conversation_id=@conversation_id;
			DELETE FROM Conversation WHERE id=@conversation_id;
			`);
	const result = await transaction.commit();
	console.log('conversation deleted successfully');
	return result;
}
export async function selectMessages(convIntId: number, userId: number) {
	return (await sqlConnectionPool.connect())
		.request()
		.query(
			`SELECT * FROM Message WHERE conversation_id = '${convIntId}' AND user_id = ${userId} ORDER BY message_order ASC`,
		);
}
