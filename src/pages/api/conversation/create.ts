// import type { VercelRequest, VercelResponse } from '@vercel/node';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
export default async function handler(
	request: NextApiRequest,
	response: NextApiResponse,
) {
	const session = await getServerSession(request, response, authOptions);
	console.log('session: ', session);
	response.send(`Hello world!`);
}
