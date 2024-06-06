import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { TUserFromDB } from '@/types/types';
import { insertQuestion, selectMessages } from '@/models/message';
import { selectDocument } from '@/models/document';
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
		const convIntId = (await selectConvByStr(convStringId)).id;
		const docuName = (await selectDocument(docuId, convIntId)).document_name;
		await insertQuestion(convIntId, questionContent, user.user_id, docuName);
		const newMessages = await selectMessages(convIntId, user.user_id);
		response.send({ messages: newMessages, questionDocName: docuName });
	} catch (error) {
		console.log('error: ', error);
		response.status(500).send(error);
	}
}
