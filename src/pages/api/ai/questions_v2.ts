import createAIChat_edge from '@/lib/createAIChat_edge';
import { getUserInfoEdge } from '@/lib/getUserInfoEdge';
// import { getUserInfoEdge } from '@/utils/getUserInfoEdge';
import MessageGenerator from '@/utils/messageGenerator';
import { RequestContext } from '@vercel/edge';
import { ChatCompletionRequestMessage } from 'openai-edge';

export const runtime = 'edge';
export default async function POST(request: Request) {
	try {
		const userInfo = await getUserInfoEdge(request);
		console.log('userInfo: ', userInfo);
		if (!userInfo) {
			throw new Error('Invalid user');
		}
		const body = await request.json();
		const convStringId = body.convStringId;
		const docuId = body.docuId;

		if (!convStringId || !docuId) {
			throw new Error('Parameter Error');
		}
		const data = JSON.stringify({
			checkFromMe: 'me',
			convStringId,
			docuId,
		});
		const paraRes = await fetch(
			process.env.API_ENDPOINT + '/api/paragraph/getParagraphQuestion',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: data,
				mode: 'same-origin',
				cache: 'no-cache',
			},
		);
		const { joinedParagraphs } = await paraRes.json();
		const prompt = MessageGenerator.presetQuestion(
			joinedParagraphs as string,
		);

		const messages: ChatCompletionRequestMessage[] = [];
		messages.push({
			role: 'user',
			content: prompt.content as string,
		});

		const res = await createAIChat_edge(messages, 'gpt-3.5-turbo');

		return res;
	} catch (error) {
		console.log('error: ', error);
		return new Response('Error occured', {
			status: 500,
		});
	}
}
