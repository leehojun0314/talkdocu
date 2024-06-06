import { TExtendedSession, TUserFromDB } from '@/types/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { getUserInfoFromSession } from '@/models/user';
import { selectConversations } from '@/models/conversation';

export default async function handler(
	request: NextApiRequest,
	response: NextApiResponse,
) {
	if (request.method !== 'GET') {
		response.status(400).send('bad request');
		return;
	}
	try {
		const session: TExtendedSession = await getServerSession(
			request,
			response,
			authOptions,
		);
		const user: TUserFromDB = await getUserInfoFromSession(session);

		const conversations = await selectConversations(user.user_id);

		response.status(200).send({ conversations });
	} catch (error) {
		console.log(error);
		response.status(500).send(error);
	}
}
