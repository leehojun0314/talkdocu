import { configs } from '@/config';
import {
  TExtendedSession,
  TProvider,
  TStatus,
  TUserFromDB,
} from '@/types/types';
import mssql from 'mssql';
export const sqlConnectionPool = new mssql.ConnectionPool({
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
    .input('user_email', userEmail)
    .input('provider', provider)
    .query(
      `SELECT * FROM UserTable WHERE user_email = @user_email AND auth_type = @provider`,
    );
}
export async function insertUser(
  userName: string,
  userEmail: string,
  profileImg: string,
  authType: TProvider,
  authId: string,
) {
  return (await sqlConnectionPool.connect())
    .request()
    .input('user_name', userName)
    .input('user_email', userEmail)
    .input('profile_img', profileImg)
    .input('auth_type', authType)
    .input('auth_id', authId).query(`
	INSERT INTO UserTable (user_name, user_email, profile_img, auth_type, auth_id, last_login)
	OUTPUT INSERTED.*
	VALUES (@user_name, @user_email, @profile_img, @auth_type, @auth_id, GETDATE())
	`);
}
export async function getUserInfoFromSession(session: TExtendedSession | null) {
  const { recordset } = await selectUser(
    session?.user?.email ?? '',
    session?.provider,
  );
  console.log('recordset:', recordset);

  console.log('session:', session);
  if (!recordset.length && session?.user && session?.user?.name) {
    console.log('new user');
    const insertedUser = await insertUser(
      session.user.name as string,
      session.user.email as string,
      session.user.image as string,
      session.provider as TProvider,
      session.authId as string,
    );
    console.log('inserted User:', insertedUser);
    return insertedUser.recordset[0];
  } else {
    return recordset[0];
  }
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
    .input('question_message', configs.question_message)
    .query(`INSERT INTO Conversation (conversation_name, user_id, created_at, status, conversation_id, salutation, visibility, question_message) 
        OUTPUT INSERTED.id VALUES (@conversation_name, @user_id, GETDATE(), 'analyzing', @conversation_id, @salutation, 0, @question_message)`);
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
export async function updateConv({
  convIntId,
  userId,
  newName,
  newSalutation,
}: {
  convIntId: number;
  userId: number;
  newName: string;
  newSalutation: string;
}) {
  try {
    const sqlPool = await sqlConnectionPool.connect();
    const transaction = sqlPool.transaction();
    await transaction.begin();

    // Check if Conversation exists and user_id matches
    const conversation = await transaction
      .request()
      .input('conversation_id', convIntId)
      .input('user_id', userId).query(`SELECT *
					FROM Conversation
					WHERE id = @conversation_id AND user_id = @user_id`);

    if (conversation.recordset.length === 0) {
      throw new Error('Conversation not found for the given user');
    }

    // Update Conversation name
    await transaction
      .request()
      .input('conversation_id', convIntId)
      .input('conversation_name', newName)
      .input('salutation', newSalutation)
      .query(
        'UPDATE Conversation SET conversation_name=@conversation_name, salutation=@salutation WHERE id=@conversation_id',
      );

    await transaction.commit();
    console.log('Conversation name updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating conversation name:', error);
    throw error;
  }
}
// export async function insertDocument({
// 	documentName,
// 	documentUrl,
// 	documentSize,
// 	convIntId,
// }: {
// 	documentName: string;
// 	documentUrl: string;
// 	documentSize: number;
// 	convIntId: number;
// }) {
// 	return (await sqlConnectionPool.connect())
// 		.request()
// 		.input('document_name', documentName)
// 		.input('document_url', documentUrl)
// 		.input('document_size', documentSize)
// 		.input('conversation_id', convIntId)
// 		.query(
// 			`INSERT INTO Document (document_name, document_url, document_size, conversation_id)
// 						OUTPUT INSERTED.document_id VALUES (@document_name, @document_url, @document_size, @conversation_id)`,
// 		);
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
export async function selectConversation(
  user: TUserFromDB,
  convStringId: string,
) {
  return (await sqlConnectionPool.connect())
    .request()
    .query(
      `SELECT * FROM Conversation WHERE conversation_id = '${convStringId}' AND (visibility = 1 OR (visibility = 0 AND user_id = ${user.user_id}))`,
    );
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
export async function selectDebate(answerId: number, userId: number) {
  return (await sqlConnectionPool.connect())
    .request()
    .input('answer_id', answerId)
    .input('user_id', userId).query(`
	SELECT 
		D.debate_id, 
		D.question_id, 
		D.answer_id, 
		D.refer_content,
		QM.message AS question_content,
		AM.message AS answer_content
	FROM 
		Debate D
	LEFT JOIN 
		Message QM ON D.question_id = QM.message_id
	LEFT JOIN 
		Message AM ON D.answer_id = AM.message_id
	WHERE 
		D.answer_id = @answer_id AND D.user_id = @user_id;`);
}
export async function selectDebateById(debateId: number) {
  return (await sqlConnectionPool.connect())
    .request()
    .input('debate_id', debateId).query(`
	SELECT * FROM Debate WHERE debate_id = @debate_id`);
}
export async function selectDebateMessages(debateId: number, userId: number) {
  return (await sqlConnectionPool.connect())
    .request()
    .query(
      `SELECT * FROM Debate_Message WHERE debate_id = ${debateId} AND user_id = ${userId} ORDER BY id ASC`,
    );
}
