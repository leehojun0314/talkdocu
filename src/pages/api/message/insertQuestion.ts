import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { TUserFromDB } from '@/types/types';
import { insertQuestion, selectMessages } from '@/models/message';
import { selectDocument } from '@/models/document';
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
		const { questionContent, convStringId, docuId } = await request.json();
		if (!questionContent || !convStringId || !docuId) {
			// response.status(404).send('Invalid parameters');
			return new Response('Invalid parameters', { status: 404 });
		}
		const convIntId = (await selectConvByStr(convStringId)).id;
		const docuName = (await selectDocument(docuId, convIntId)).document_name;
		await insertQuestion(convIntId, questionContent, user.user_id, docuName);
		const newMessages = await selectMessages(convIntId, user.user_id);
		// response.send({ messages: newMessages, questionDocName: docuName });
		return new Response(
			JSON.stringify({ messages: newMessages, questionDocName: docuName }),
			{ status: 200, headers: { 'Content-Type': 'application/json' } },
		);
	} catch (error) {
		console.log('error: ', error);
		// response.status(500).send(error);
		return new Response(getErrorMessage(error), { status: 500 });
	}
}
