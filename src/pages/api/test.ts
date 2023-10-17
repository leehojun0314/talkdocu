// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { Configuration, OpenAIApi } from 'openai-edge';
type Data = {
	name: string;
};
const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
export const runtime = 'edge';
export default async function GET(req: Request) {
	console.log('get called');

	const json = await req.json();
	const { messages, previewToken } = json;
	console.log('messages:', messages);
	console.log('previewToken:', previewToken);
	const res = await openai.createChatCompletion({
		model: 'gpt-3.5-turbo',
		messages: [
			{
				role: 'user',
				content: '안녕 내 이름은 이호준이야.',
			},
		],
		temperature: 0.7,
		stream: true,
	});
	const stream = OpenAIStream(res, {
		async onCompletion(completion) {
			console.log('completion: ', completion);
		},
	});
	return new StreamingTextResponse(stream);
	// return new Response('hello world');
	// res.status(200).json({ name: 'John Doe' });
}
