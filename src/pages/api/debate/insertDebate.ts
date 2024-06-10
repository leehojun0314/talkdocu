// import // getUserInfoFromSession,
// // selectConvByStr,
// // selectDebateMessages,
// '@/models';
import { insertDebateMessage, selectDebateMessages } from '@/models/debate';
import { TUserFromDB } from '@/types/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { getUserInfoFromSession } from '@/models/user';
import { selectConvByStr } from '@/models/conversation';
import { getUserInfoEdge } from '@/lib/getUserInfoEdge';
import { getErrorMessage } from '@/utils/errorMessage';
export const runtime = 'edge';
export default async function POST(request: Request) {
	try {
		const user: TUserFromDB = await getUserInfoEdge(request);
		if (!user) {
			// response.status(401).send('Unauthorized');
			return new Response('Unauthorized', { status: 401 });
		}
		const { userMessage, answerMessage, convStringId, debateId } =
			await request.json();

		if (!userMessage || !answerMessage || !convStringId || !debateId) {
			// response.status(400).send('Invalid parameter');
			return new Response('Invalid parameter', { status: 400 });
		}
		const convIntId = (await selectConvByStr(convStringId)).id;
		if (!convIntId) {
			// response.status(400).send('Invalid conv id');
			return new Response('Invalid conv id', { status: 400 });
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
		// response.send({ messages: newMessages });
		return new Response(JSON.stringify({ messages: newMessages }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	} catch (error) {
		console.log('insert debate error: ', error);
		// response.status(500).send(error);
		return new Response(getErrorMessage(error), { status: 500 });
	}
}
