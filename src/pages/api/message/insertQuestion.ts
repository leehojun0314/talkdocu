import {
	getUserInfoFromSession,
	selectConvByStr,
	selectMessages,
} from '@/models';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { TUserFromDB } from '@/types/types';
import { insertQuestion } from '@/models/message';
import { selectDocument } from '@/models/document';

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
		const { questionContent, convStringId, docuId } = request.body;
		if (!questionContent || !convStringId || !docuId) {
			response.status(404).send('Invalid parameters');
			return;
		}
		const convIntId = (await selectConvByStr(convStringId)).recordset[0].id;
		const docuName = (await selectDocument(docuId, convIntId)).recordset[0]
			.document_name;
		await insertQuestion(convIntId, questionContent, user.user_id, docuName);
		const newMessages = (await selectMessages(convIntId, user.user_id))
			.recordset;
		response.send({ messages: newMessages, questionDocName: docuName });
	} catch (error) {
		console.log('error: ', error);
		response.status(500).send(error);
	}
}
