import { OpenAIStream, StreamingTextResponse } from 'ai';
import {
	ChatCompletionRequestMessage,
	Configuration,
	CreateChatCompletionRequest,
	OpenAIApi,
} from 'openai-edge';

export default async function createAIChat_edge(
	messages: ChatCompletionRequestMessage[],
	model: CreateChatCompletionRequest['model'],
) {
	const configuration = new Configuration({
		apiKey: process.env.OPENAI_API_KEY,
		organization: process.env.OPENAI_ORGANIZATION,
	});
	const openai = new OpenAIApi(configuration);
	const res = await openai.createChatCompletion({
		model,
		messages,
		temperature: 0.7,
		stream: true,
	});
	const stream = OpenAIStream(res);
	return new StreamingTextResponse(stream);
}
