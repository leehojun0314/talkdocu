import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { TExtendedSession } from '@/types/types';
import { decode } from 'next-auth/jwt';
import { NextApiRequest } from 'next';
import { getUserInfoFromSession } from '@/models/user';

export default async function handler(
	request: NextApiRequest,
	response: VercelResponse,
) {
	// const { name = 'World' } = request.query;
	const session: TExtendedSession = await getServerSession(
		request,
		response,
		authOptions,
	);
	const decoded = await decode({
		token: request.cookies['next-auth.session-token'],
		secret: process.env.NEXTAUTH_SECRET ?? '',
	});
	const user = await getUserInfoFromSession(session);
	response.send({ session, user, decoded });
}
