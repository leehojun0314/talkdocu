// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { Configuration, OpenAIApi } from 'openai-edge';
import { authOptions } from './auth/[...nextauth]';
import { getToken } from 'next-auth/jwt';
type Data = {
	name: string;
};
const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
export const runtime = 'edge';
export default async function POST(request: Request) {
	console.log('get called');
	// const session = await getServerSession(authOptions);
	// console.log('session: ', session);
	// const session = await getToken({req : request})
	// const json = await request.json();
	// const { messages, previewToken } = json;
	// console.log('messages:', messages);
	// console.log('previewToken:', previewToken);
	const res = await openai.createChatCompletion({
		model: 'gpt-4-1106-preview',
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
