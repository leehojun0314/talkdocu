import MessageGenerator from '@/utils/messageGenerator';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources';
import { ChatCompletionCreateParamsBase } from 'openai/resources/chat/completions';

export default async function createAIChatStream(
	messages: ChatCompletionMessageParam[],
	model: ChatCompletionCreateParamsBase['model'],
	streamCallback: ({
		isEnd,
		text,
		error,
	}: {
		isEnd: boolean;
		text: string;
		error?: unknown;
	}) => void,
) {
	const openai = new OpenAI({
		apiKey: process.env.OPENAI_API_KEY,
		organization: process.env.OPENAI_ORGARNIZATION,
	});
	let finalText = '';
	try {
		const completion = await openai.chat.completions.create({
			model: model,
			messages: messages,
			stream: true,
		});
		for await (const chunk of completion) {
			if (chunk.choices[0].finish_reason === 'stop') {
				streamCallback({ isEnd: true, text: finalText });
				return;
			}
			const text = chunk.choices[0].delta.content;
			finalText += text;
			streamCallback({
				isEnd: false,
				text: text ? text : '',
			});
		}
	} catch (error) {
		console.log('create ai chat eror: ', error);
		streamCallback({
			isEnd: true,
			text: finalText,
			error: error,
		});
	}
}
