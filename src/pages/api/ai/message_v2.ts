import createAIChat_edge from '@/lib/createAIChat_edge';
import { getUserInfoEdge } from '@/lib/getUserInfoEdge';
import MessageGenerator from '@/utils/messageGenerator';
import { ChatCompletionRequestMessage } from 'openai-edge';

export const runtime = 'edge';
export default async function POST(request: Request) {
	try {
		const userInfo = await getUserInfoEdge(request);
		if (!userInfo) {
			return new Response('Invalid user', {
				status: 401,
			});
		}
		const body = await request.json();
		const convStringId = body.convStringId;
		const relatedContent = body.relatedContent;
		const text = body.prompt;
		if (!convStringId || !relatedContent || !text) {
			return new Response('Invalid parameter', { status: 400 });
		}
		const prompt = MessageGenerator.systemMessage(relatedContent);
		const messages: ChatCompletionRequestMessage[] = [];
		messages.push({
			role: 'system',
			content: prompt.content as string,
		});
		messages.push({
			role: 'user',
			content: text,
		});
		const res = await createAIChat_edge(messages, 'gpt-4');
		return res;
	} catch (error) {
		return new Response('Error occured', { status: 500 });
	}
}
