import { getUserInfoFromSession, selectConversation } from '@/models';
import { TExtendedSession, TUserFromDB } from '@/types/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { upsertPrompt } from '@/models/prompt';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'POST') {
    response.status(400).send('bad request');
    return;
  }
  try {
    const convStringId = request.query.convStringId as string;
    if (!convStringId) {
      response.status(400).send('You must provide conversation id.');
      return;
    }
    const session: TExtendedSession | null = await getServerSession(
      request,
      response,
      authOptions,
    );
    const user: TUserFromDB = await getUserInfoFromSession(session);
    const body = request.body;
    const prompt = body.prompt;
    const provide_content = body.provide_content;
    const conversation = await selectConversation(user, convStringId);
    console.log('upsert body: ', body);
    if (!conversation.recordset.length) {
      response.status(400).send('Conversation not found.');
      return;
    }
    const result = await upsertPrompt(
      prompt,
      provide_content,
      conversation.recordset[0].id,
      user.user_id,
    );
    console.log('upsert prompt result: ', result);
    response.status(200).send('success');
  } catch (err) {
    console.log('prompt upsert error: ', err);
    response.status(500).send(err);
  }
}
