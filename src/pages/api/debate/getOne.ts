import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { TUserFromDB } from '@/types/types';
import {
	getUserInfoFromSession,
	selectDebate,
	selectDebateMessages,
} from '@/models';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== 'GET') {
		res.status(400).send('Bad request');
		return;
	}
	const answerId = Number(req.query.answerId as string);
	if (!answerId) {
		res.status(400).send('Invalid request');
		return;
	}
	try {
		const session = await getServerSession(req, res, authOptions);
		const user: TUserFromDB = await getUserInfoFromSession(session);
		const debateRes = await selectDebate(answerId, user.user_id);
		console.log('debate res:', debateRes);
		if (!debateRes.recordset.length) {
			res.status(400).send("Debate doesn't exist");
			return;
		}
		const debateMesRes = await selectDebateMessages(
			debateRes.recordset[0].debate_id,
			user.user_id,
		);
		res.send({
			debate: debateRes.recordset[0],
			messages: debateMesRes.recordset,
		});
	} catch (error) {
		console.log('error: ', error);
		res.status(500).send(error);
	}
}
