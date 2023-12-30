import {
	getUserInfoFromSession,
	selectConvByStr,
	selectMessages,
} from '@/models';
import { insertMessage } from '@/models/message';
import { TUserFromDB } from '@/types/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { referenceDocsToString } from '@/utils/functions';
import { insertDebate } from '@/models/debate';

export default async function handler(
	request: NextApiRequest,
	response: NextApiResponse,
) {
	if (request.method !== 'POST') {
		response.status(404).send('Not found');
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
		console.log('request body: ', request.body);
		const {
			userMessage,
			answerMessage,
			convStringId,
			referenceDocs,
			relatedContent,
		} = request.body;
		if (!userMessage || !answerMessage || !convStringId || !referenceDocs) {
			response.status(400).send('Invalid parameters');
			return;
		}
		const convIntId = (await selectConvByStr(convStringId)).recordset[0].id;
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
		const newMessages = (await selectMessages(convIntId, user.user_id))
			.recordset;
		const questionId = insertQuestionRes.recordset[0].message_id;
		const answerId = insertAnswerRes.recordset[0].message_id;

		await insertDebate(
			questionId,
			answerId,
			relatedContent,
			convIntId,
			user.user_id,
		);
		response.send({ messages: newMessages, referenceDocs });
	} catch (error) {
		console.log('insert message error: ', error);
		response.status(500).send(error);
	}
}
