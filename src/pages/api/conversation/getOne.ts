import { TExtendedSession, TUserFromDB } from '@/types/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import {
	selectConversations,
	getUserInfoFromSession,
	selectConversation,
	selectDocuments,
	selectMessages,
} from '@/models';

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
		const convRes = await selectConversation(user, convStringId);
		const docRes = await selectDocuments(convRes.recordset[0].id);
		const mesRes = await selectMessages(
			convRes.recordset[0].id,
			user.user_id,
		);

		response.status(200).send({
			conversation: convRes.recordset[0],
			documents: docRes.recordset,
			messages: mesRes.recordset,
		});
	} catch (error) {
		console.log(error);
		response.status(500).send(error);
	}
}
