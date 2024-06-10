import { TExtendedSession, TUserFromDB } from '@/types/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { getUserInfoFromSession } from '@/models/user';
import { selectConversation } from '@/models/conversation';
import { selectDocuments } from '@/models/document';
import { selectMessages } from '@/models/message';
import { getUserInfoEdge } from '@/lib/getUserInfoEdge';
import { getErrorMessage } from '@/utils/errorMessage';
// import {
// 	selectConversations,
// 	getUserInfoFromSession,
// 	selectConversation,
// 	selectDocuments,
// 	selectMessages,
// } from '@/models';
export const runtime = 'edge';
export default async function GET(request: Request) {
	// if (request.method !== 'GET') {
	// 	response.status(400).send('bad request');
	// 	return;
	// }
	try {
		// const convStringId = request.query.convStringId as string;
		// const convStringId = await request.json();
		const params = new URL(request.url).searchParams;
		const convStringId = params.get('convStringId');
		if (!convStringId) {
			// response.status(400).send('You must provide conversation id.');
			return new Response('You must provide conversation id', {
				status: 400,
			});
		}
		// const session: TExtendedSession | null = await getServerSession(
		// 	request,
		// 	response,
		// 	authOptions,
		// );
		const user: TUserFromDB = await getUserInfoEdge(request);

		const convRes = await selectConversation(user.user_id, convStringId);
		const docRes = await selectDocuments(convRes.id);
		const mesRes = await selectMessages(convRes.id, user.user_id);
		// response.status(200).send({
		// 	conversation: convRes,
		// 	documents: docRes,
		// 	messages: mesRes,
		// });
		return new Response(
			JSON.stringify({
				conversation: convRes,
				documents: docRes,
				messages: mesRes,
			}),
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);
	} catch (error) {
		console.log(error);
		// response.status(500).send(error);
		return new Response(getErrorMessage(error), { status: 500 });
	}
}
