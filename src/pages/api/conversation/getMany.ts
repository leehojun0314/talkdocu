import { TExtendedSession, TUserFromDB } from '@/types/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { getUserInfoFromSession } from '@/models/user';
import { selectConversations } from '@/models/conversation';
import { getUserInfoEdge } from '@/lib/getUserInfoEdge';
import { getErrorMessage } from '@/utils/errorMessage';
export const runtime = 'edge';
export default async function GET(request: Request) {
	try {
		// const session: TExtendedSession = await getServerSession(
		// 	request,
		// 	response,
		// 	authOptions,
		// );
		const user: TUserFromDB = await getUserInfoEdge(request);

		const conversations = await selectConversations(user.user_id);

		// response.status(200).send({ conversations });
		return new Response(JSON.stringify({ conversations }), {
			status: 200,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	} catch (error) {
		console.log('get many conversation error: ', error);
		// response.status(500).send(error);
		return new Response(getErrorMessage(error), {
			status: 500,
		});
	}
}
