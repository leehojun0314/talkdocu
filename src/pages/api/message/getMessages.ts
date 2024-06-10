import { TUserFromDB } from '@/types/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { getUserInfoFromSession } from '@/models/user';
import { selectConvByStr } from '@/models/conversation';
import { selectMessages } from '@/models/message';
import { getUserInfoEdge } from '@/lib/getUserInfoEdge';
import { getErrorMessage } from '@/utils/errorMessage';
export const runtime = 'edge';
export default async function GET(request: Request) {
	try {
		console.log('get messages');

		const params = new URL(request.url).searchParams;
		const convStringId = params.get('convStringId');
		const user: TUserFromDB = await getUserInfoEdge(request);
		if (!convStringId) {
			throw new Error('You must provide conversation id.');
		}
		const conversationRes = await selectConvByStr(convStringId);
		const convIntId = conversationRes.id;
		const messagesRes = await selectMessages(convIntId, user.user_id);
		const messages = messagesRes;
		console.log('messages: ', messages);

		// response.send(messages);
		return new Response(JSON.stringify(messages), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.log('error: ', error);
		// response.status(500).send(error);
		return new Response(getErrorMessage(error), { status: 500 });
	}
}
