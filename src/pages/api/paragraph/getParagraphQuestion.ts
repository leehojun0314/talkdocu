import { configs } from '@/config';
import { selectConvByStr } from '@/models/conversation';
import { selectParagraphDocu } from '@/models/paragraph';
import { getErrorMessage } from '@/utils/errorMessage';
import { NextApiRequest, NextApiResponse } from 'next';
export const runtime = 'edge';
export default async function POST(request: Request) {
	const { checkFromMe, convStringId, docuId } = await request.json();
	if (checkFromMe !== 'me' || !convStringId || !docuId) {
		// response.status(404).send('Bad request');
		return new Response('Invalid parameter', { status: 400 });
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
		// response.json({ joinedParagraphs });
		return new Response(JSON.stringify({ joinedParagraphs }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		console.log(' get para question error: ', error);

		// response.status(500).send(error);
		return new Response(getErrorMessage(error), { status: 500 });
	}
}
