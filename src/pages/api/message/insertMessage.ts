import { insertMessage, selectMessages } from '@/models/message';
import { TUserFromDB } from '@/types/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { referenceDocsToString } from '@/utils/functions';
import { insertDebate } from '@/models/debate';
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
		console.log('request body: ', request.body);
		const {
			userMessage,
			answerMessage,
			convStringId,
			referenceDocs,
			relatedContent,
		} = await request.json();

		if (!userMessage || !answerMessage || !convStringId || !referenceDocs) {
			// response.status(400).send('Invalid parameters');
			return new Response('Invalid parameters', { status: 400 });
		}
		const convIntId = (await selectConvByStr(convStringId)).id;
		const insertQuestionRes = await insertMessage(
			userMessage,
			convIntId,
			'user',
			user.user_id,
		);
		const insertAnswerRes = await insertMessage(
			answerMessage + '\n' + referenceDocsToString(referenceDocs),
			convIntId,
			'assistant',
			user.user_id,
		);
		const newMessages = await selectMessages(convIntId, user.user_id);
		const questionId = insertQuestionRes.message_id;
		const answerId = insertAnswerRes.message_id;

		await insertDebate(
			questionId,
			answerId,
			relatedContent,
			convIntId,
			user.user_id,
		);
		// response.send({ messages: newMessages, referenceDocs });
		return new Response(
			JSON.stringify({ messages: newMessages, referenceDocs }),
			{
				status: 200,
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);
	} catch (error) {
		console.log('insert message error: ', error);
		// response.status(500).send(error);
		return new Response(getErrorMessage(error), { status: 500 });
	}
}
