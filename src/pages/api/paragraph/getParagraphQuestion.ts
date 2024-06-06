import { configs } from '@/config';
import { selectConvByStr } from '@/models/conversation';
import { selectParagraphDocu } from '@/models/paragraph';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	request: NextApiRequest,
	response: NextApiResponse,
) {
	if (request.method !== 'POST') {
		response.status(404).send('Bad request');
		return;
	}
	const { checkFromMe, convStringId, docuId } = request.body;
	if (checkFromMe !== 'me' || !convStringId || !docuId) {
		response.status(404).send('Bad request');
		return;
	}
	try {
		const convIntId = (await selectConvByStr(convStringId)).id;
		console.log('conv int id: ', convIntId);
		const paragraphs = await selectParagraphDocu(docuId, convIntId);

		const joinedParagraphs = paragraphs
			.map((p) => p.paragraph_content)
			.join(' ')
			.slice(0, configs.relatedParagraphLength);
		console.log('joined paragraph:', joinedParagraphs);
		response.json({ joinedParagraphs });
	} catch (error) {
		console.log('error: ', error);

		response.status(500).send(error);
	}
}
