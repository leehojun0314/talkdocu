// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import {
	OpenAIStream,
	StreamingTextResponse,
	experimental_StreamData,
} from 'ai';
import { Configuration, OpenAIApi } from 'openai-edge';
import { authOptions } from './auth/[...nextauth]';
import { NextApiRequest, NextApiResponse } from 'next';
// import { extractToken } from '@/utils/functions';
// import { decode } from 'next-auth/jwt';
import * as jose from 'jose';
import type { RequestContext } from '@vercel/edge';
import { getUserInfoEdge } from '@/lib/getUserInfoEdge';
type Data = {
	name: string;
};
const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
export const runtime = 'edge';

export default async function POST(request: Request, context: RequestContext) {
	console.log('get called');
	// context.waitUntil(getAlbum().then((json) => console.log({ json })));
	try {
		const userInfo = await getUserInfoEdge(request);
		console.log('user info; ', userInfo);
		const body = await request.json();
		console.log('body: ', body);
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
			onFinal(completion) {
				data.close();
			},
			experimental_streamData: true,
		});

		return new StreamingTextResponse(stream, undefined, data);
	} catch (error) {
		console.log('error: ', error);
		return new Response('Error occured');
	}
}
// const POST = async (req: Response) => {
// 	try {
// 		const completion = await openai.createChatCompletion({
// 			model: 'gpt-3.5-turbo',
// 			messages: [
// 				{ role: 'user', content: 'Who won the world series in 2020?' },
// 			],
// 			max_tokens: 1024,
// 			temperature: 0,
// 			stream: true,
// 		});

// 		const transformStream = new TransformStream({
// 			transform(chunk, controller) {
// 				// 여기에서 chunk를 수정
// 				// 예: controller.enqueue(modifyChunk(chunk, yourAdditionalData));

// 				// 원본 데이터 전송
// 				controller.enqueue(chunk);
// 				console.log('chunk : ', chunk);
// 			},
// 		});
// 		if (!completion.body) {
// 			console.log('completion body is empty');
// 		} else {
// 			completion.body.pipeThrough(transformStream);

// 			return new Response(transformStream.readable, {
// 				headers: {
// 					'Access-Control-Allow-Origin': '*',
// 					'Content-Type': 'text/event-stream;charset=utf-8',
// 					'Cache-Control': 'no-cache, no-transform',
// 					'X-Accel-Buffering': 'no',
// 				},
// 			});
// 		}
// 	} catch (error: any) {
// 		console.error(error);

// 		return new Response(JSON.stringify(error), {
// 			status: 400,
// 			headers: {
// 				'content-type': 'application/json',
// 			},
// 		});
// 	}
// };
// export default POST;
function extractToken(cookieString: string | null) {
	if (!cookieString) {
		return null;
	}
	// console.log('cookie string: ', cookieString);
	const cookies = cookieString.split('; '); // 세미콜론과 공백으로 분리
	for (let i = 0; i < cookies.length; i++) {
		const [key, value] = cookies[i].split('='); // 각 쿠키를 키와 값으로 분리
		if (key === 'next-auth.session-token') {
			return value.replace(' ', ''); // 원하는 키를 찾으면 값을 반환
		}
	}
	return null; // 해당 키가 없으면 null 반환
}
