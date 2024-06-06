import { TExtendedSession, TUserFromDB } from '@/types/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { getUserInfoFromSession } from '@/models/user';
import { selectConversation } from '@/models/conversation';
import { selectDocuments } from '@/models/document';
import { selectMessages } from '@/models/message';
// import {
// 	selectConversations,
// 	getUserInfoFromSession,
// 	selectConversation,
// 	selectDocuments,
// 	selectMessages,
// } from '@/models';

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
		const convRes = await selectConversation(user.user_id, convStringId);
		const docRes = await selectDocuments(convRes.id);
		const mesRes = await selectMessages(convRes.id, user.user_id);

		response.status(200).send({
			conversation: convRes,
			documents: docRes,
			messages: mesRes,
		});
	} catch (error) {
		console.log(error);
		response.status(500).send(error);
	}
}
