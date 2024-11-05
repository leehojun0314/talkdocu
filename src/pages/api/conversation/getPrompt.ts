import { TExtendedSession, TUserFromDB } from '@/types/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { authOptions } from '../auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { getUserInfoFromSession, selectConversation } from '@/models';
import { getPrompt } from '@/models/prompt';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'GET') {
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
    const conversation = await selectConversation(user, convStringId);
    const result = await getPrompt(conversation.recordset[0].id, user.user_id);
    console.log('upsert prompt result: ', result);
    response.status(200).send(result);
  } catch (err) {
    console.log('prompt upsert error: ', err);
    response.status(500).send(err);
  }
}
