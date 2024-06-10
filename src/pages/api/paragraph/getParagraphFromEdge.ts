import { TDocument, TParagraph_DB, TUserFromDB } from '@/types/types';
import { NextApiRequest, NextApiResponse } from 'next';
import getRelatedParaClosevector from '@/lib/getRelatedParaClosevector';
import { selectConvByStr } from '@/models/conversation';
import { selectDocuments } from '@/models/document';
import { selectParagraphConv } from '@/models/paragraph';

export default async function handler(
	request: NextApiRequest,
	response: NextApiResponse,
) {
	if (request.method !== 'POST') {
		response.status(404).send('Bad request');
		return;
	}
	const { convStringId, text, userEmail, userProvider } = request.body;
	if (!convStringId || !text || !userEmail || !userProvider) {
		response.status(404).send('Bad request');
		return;
	}
	try {
		// const user: TUserFromDB = await getUserInfoFromSession(
		// 	await getServerSession(request, response, authOptions),
		// );
		// if (!user) {
		// 	response.status(401).send('Invalid user');
		// 	return;
		// }
		console.log('get paragraph body: ', request.body);
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
