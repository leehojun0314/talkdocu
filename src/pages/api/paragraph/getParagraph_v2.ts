import { TDocument, TParagraph_DB, TUserFromDB } from '@/types/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { selectParagraphConv } from '@/models/paragraph';
import getRelatedParaClosevector from '@/lib/getRelatedParaClosevector';
import { getUserInfoFromSession } from '@/models/user';
import { selectConvByStr } from '@/models/conversation';
import { selectDocuments } from '@/models/document';

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
		const documents: TDocument[] = await selectDocuments(convIntId);
		const paragraphs: TParagraph_DB[] = await selectParagraphConv(convIntId);

		if (!documents.length || !paragraphs.length) {
			response.status(400).send('There is no document');
			return;
		}
		const { relatedContent, referenceDocs } = await getRelatedParaClosevector(
			text,
			paragraphs,
			documents,
		);
		console.log('relatedContent: ', relatedContent);
		response.json({ relatedContent, referenceDocs });
	} catch (error) {
		console.log('get paragraph error: ', error);
		response.status(500).send(error);
	}
}
