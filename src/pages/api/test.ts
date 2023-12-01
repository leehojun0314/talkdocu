// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
	OpenAIStream,
	StreamingTextResponse,
	experimental_StreamData,
} from 'ai';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { Configuration, OpenAIApi } from 'openai-edge';
import { authOptions } from './auth/[...nextauth]';
import { getToken, decode } from 'next-auth/jwt';
import { extractToken } from '@/utils/functions';

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

	try {
		const jwt = extractToken(request.headers.get('cookie'));
		console.log('cookie: ', jwt);
		const decoded = await decode({
			token: jwt ?? '',
			secret: process.env.NEXTAUTH_SECRET ?? '',
		});
		console.log('decoded: ', decoded);
		const json = await request.json();

		console.log('json: ', json);
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
		const data = new experimental_StreamData();
		data.append({ test: 'data' });
		const stream = OpenAIStream(res, {
			async onCompletion(completion) {
				console.log('completion: ', completion);
			},
			onFinal(completion) {
				data.close();
			},
			experimental_streamData: true,
		});

		const dataObj = JSON.stringify({ test: 'data' });
		// console.log('data: ', data);
		return new StreamingTextResponse(stream, undefined, data);
	} catch (error) {
		console.log('error: ', error);
		return new Error('Error occured');
	}
}
