import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { TUserFromDB } from '@/types/types';
import { getUserInfoFromSession } from '@/models/user';
import { selectDebate, selectDebateMessages } from '@/models/debate';
import { getUserInfoEdge } from '@/lib/getUserInfoEdge';
import { getErrorMessage } from '@/utils/errorMessage';
// import {
// 	getUserInfoFromSession,
// 	selectDebate,
// 	selectDebateMessages,
// } from '@/models';

export const runtime = 'edge';
export default async function GET(request: Request) {
	// if (req.method !== 'GET') {
	// 	res.status(400).send('Bad request');
	// 	return;
	// }
	// const answerId = Number(req.query.answerId as string);
	const params = new URL(request.url).searchParams;
	const answerId: number = Number(params.get('answerId'));
	if (!answerId) {
		// res.status(400).send('Invalid request');
		return new Response('Invalid parameter', { status: 400 });
	}
	try {
		// const session = await getServerSession(req, res, authOptions);
		const user: TUserFromDB = await getUserInfoEdge(request);
		const debateRes = await selectDebate(answerId, user.user_id);
		console.log('debate res:', debateRes);
		if (!debateRes) {
			// res.status(400).send("Debate doesn't exist");
			return new Response('Debate does not exist', { status: 400 });
		}
		const debateMesRes = await selectDebateMessages(
			debateRes.debate_id,
			user.user_id,
		);
		// res.send({
		// 	debate: debateRes,
		// 	messages: debateMesRes,
		// });
		return new Response(
			JSON.stringify({ debate: debateRes, messages: debateMesRes }),
			{ status: 200, headers: { 'Content-Type': 'application/json' } },
		);
	} catch (error) {
		console.log('get one error: ', error);
		// res.status(500).send(error);
		return new Response(getErrorMessage(error), { status: 500 });
	}
}
