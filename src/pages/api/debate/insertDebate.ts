import // getUserInfoFromSession,
// selectConvByStr,
// selectDebateMessages,
'@/models';
import { insertDebateMessage, selectDebateMessages } from '@/models/debate';
import { TUserFromDB } from '@/types/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { getUserInfoFromSession } from '@/models/user';
import { selectConvByStr } from '@/models/conversation';

export default async function handler(
	request: NextApiRequest,
	response: NextApiResponse,
) {
	if (request.method !== 'POST') {
		response.status(404).send('Not found');
		return;
	}
	const { userMessage, answerMessage, convStringId, debateId } = request.body;
	if (!userMessage || !answerMessage || !convStringId || !debateId) {
		response.status(400).send('Invalid parameter');
		return;
	}
	try {
		const user: TUserFromDB = await getUserInfoFromSession(
			await getServerSession(request, response, authOptions),
		);
		if (!user) {
			response.status(401).send('Unauthorized');
			return;
		}
		const convIntId = (await selectConvByStr(convStringId)).id;
		if (!convIntId) {
			response.status(400).send('Invalid conv id');
			return;
		}
		await insertDebateMessage(
			userMessage,
			'user',
			debateId,
			convIntId,
			user.user_id,
		);
		await insertDebateMessage(
			answerMessage,
			'assistant',
			debateId,
			convIntId,
			user.user_id,
		);
		const newMessages = await selectDebateMessages(debateId, user.user_id);
		response.send({ messages: newMessages });
	} catch (error) {
		console.log('error: ', error);
		response.status(500).send(error);
	}
}
