import { TUserFromDB } from '@/types/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { getUserInfoFromSession } from '@/models/user';
import { selectConvByStr } from '@/models/conversation';
import { selectMessages } from '@/models/message';

export default async function handler(
	request: NextApiRequest,
	response: NextApiResponse,
) {
	try {
		console.log('get messages');

		if (request.method !== 'GET') {
			throw new Error('Bad Request');
		}

		const convStringId = request.query.convStringId as string;
		const session = await getServerSession(request, response, authOptions);
		const user: TUserFromDB = await getUserInfoFromSession(session);
		if (!convStringId) {
			throw new Error('You must provide conversation id.');
		}
		const conversationRes = await selectConvByStr(convStringId);
		const convIntId = conversationRes.id;
		const messagesRes = await selectMessages(convIntId, user.user_id);
		const messages = messagesRes;
		console.log('messages: ', messages);

		response.send(messages);
	} catch (error) {
		console.log('error: ', error);
		response.status(500).send(error);
	}
}
