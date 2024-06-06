import { TExtendedSession, TUserFromDB } from '@/types/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { getUserInfoFromSession } from '@/models/user';
import { updateConv } from '@/models/conversation';
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	if (req.method !== 'PATCH') {
		res.status(400).send('bad request');
		return;
	}
	try {
		const convIntId = req.body.convIntId;
		const newName = req.body.newName;
		const newSalutation = req.body.newSalutation;
		const session: TExtendedSession = await getServerSession(
			req,
			res,
			authOptions,
		);
		console.log('body: ', req.body);
		const user: TUserFromDB = await getUserInfoFromSession(session);

		if (!user) {
			throw new Error('Invalid user');
		}
		if (newName && newSalutation) {
			await updateConv({
				convIntId,
				userId: user.user_id,
				newName,
				newSalutation,
			});
			res.status(200).send('Updated successfully');
		} else {
			throw new Error('name or salutation not given');
		}
	} catch (error) {
		console.log('edit error', error);
		res.status(500).send(error);
	}
}
