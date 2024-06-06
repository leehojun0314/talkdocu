import getRelatedParaPinecone from '@/lib/getRelatedParaPinecone';
import { TUserFromDB } from '@/types/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { getUserInfoFromSession } from '@/models/user';
import { selectConvByStr } from '@/models/conversation';

export default async function handler(
	request: NextApiRequest,
	response: NextApiResponse,
) {
	if (request.method !== 'POST') {
		response.status(404).send('Bad request');
		return;
	}
	const { convStringId, text } = request.body;
	if (!convStringId || !text) {
		response.status(404).send('Bad request');
		return;
	}
	try {
		const user: TUserFromDB = await getUserInfoFromSession(
			await getServerSession(request, response, authOptions),
		);
		if (!user) {
			response.status(401).send('Invalid user');
			return;
		}
		const convIntId = (await selectConvByStr(convStringId)).id;
		const { relatedContent, referenceDocs } = await getRelatedParaPinecone(
			text,
			convIntId,
		);
		console.log('relatedContent: ', relatedContent);
		response.json({ relatedContent, referenceDocs });
	} catch (error) {
		console.log('get paragraph error: ', error);
		response.status(500).send(error);
	}
}
