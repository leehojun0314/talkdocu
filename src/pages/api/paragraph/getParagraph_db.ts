import { getUserInfoFromSession, selectConvByStr } from '@/models';
import { TUserFromDB } from '@/types/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { selectParagraphConv } from '@/models/paragraph';

export default async function handler(
	request: NextApiRequest,
	response: NextApiResponse,
) {
	if (request.method !== 'GET') {
		response.status(404).send('Not found');
		return;
	}
	const user: TUserFromDB = await getUserInfoFromSession(
		await getServerSession(request, response, authOptions),
	);
	if (!user) {
		response.status(401).send('Invalid user');
		return;
	}
	console.log('request.query: ', request.query);
	const { convStringId } = request.query;
	if (!convStringId) {
		response.status(400).send('Invalid parameter');
		return;
	}
	try {
		const convIntId = (await selectConvByStr(convStringId as string))
			.recordset[0].id;
		if (!convIntId) {
			response.status(500).send('Invalid conv id');
			return;
		}
		const paragraphs = await selectParagraphConv(convIntId);
		console.log('paragrpahs:', paragraphs);
		response.send(paragraphs);
	} catch (error) {
		console.log('error: ', error);
		response.status(500).send(error);
	}
}
