import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { getUserInfoFromSession } from '@/models';
import { TExtendedSession } from '@/types';

export default async function handler(
	request: VercelRequest,
	response: VercelResponse,
) {
	// const { name = 'World' } = request.query;
	const session: TExtendedSession = await getServerSession(
		request,
		response,
		authOptions,
	);
	console.log('session: ', session);
	const user = await getUserInfoFromSession(session);
	response.send({ session, user });
}
