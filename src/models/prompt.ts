import { sqlConnectionPool } from '.';

export async function upsertPrompt(
  prompt: string,
  provide_content: boolean,
  convIntId: number,
  userId: number,
) {
  try {
    const result = await (
      await sqlConnectionPool.connect()
    )
      .request()
      .input('prompt', prompt)
      .input('provide_content', provide_content ? 1 : 0)
      .input('conversation_id', convIntId)
      .input('user_id', userId)
      .query(
        `MERGE Prompt AS target
         USING (SELECT @prompt AS prompt, @provide_content AS provide_content, @conversation_id AS conversation_id, @user_id AS user_id) AS source
         ON target.user_id = source.user_id AND target.conversation_id = source.conversation_id
         WHEN MATCHED THEN
           UPDATE SET prompt = source.prompt, provide_content = source.provide_content
         WHEN NOT MATCHED THEN
           INSERT (prompt, provide_content, conversation_id, user_id)
           VALUES (source.prompt, source.provide_content, source.conversation_id, source.user_id);`,
      );
    console.log('result: ', result);
    return result.recordset;
  } catch (error) {
    console.error('Error upserting prompt:', error);
    throw error;
  }
}

export async function getPrompt(convIntId: number, userId: number) {
  try {
    const result = await (await sqlConnectionPool.connect())
      .request()
      .input('conversation_id', convIntId)
      .input('user_id', userId)
      .query(
        `SELECT * FROM Prompt WHERE conversation_id = @conversation_id AND user_id = @user_id`,
      );
    return result.recordset[0];
  } catch (err) {
    console.log('err: ', err);
    throw err;
  }
}
