import type { NextRequest } from 'next/server';
import { Configuration, OpenAIApi } from 'openai-edge';
import { Readable } from 'stream';

const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
export const runtime = 'edge';

const POST = async (req: Response) => {
	try {
		const completion = await openai.createChatCompletion({
			model: 'gpt-3.5-turbo',
			messages: [
				{ role: 'user', content: 'Who won the world series in 2020?' },
			],
			max_tokens: 1024,
			temperature: 0,
			stream: true,
		});
		console.log('completion body: ', completion.body);
		return new Response(completion.body, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'text/event-stream;charset=utf-8',
				'Cache-Control': 'no-cache, no-transform',
				'X-Accel-Buffering': 'no',
				additional: 'test data',
			},
		});
	} catch (error: any) {
		console.error(error);

		return new Response(JSON.stringify(error), {
			status: 400,
			headers: {
				'content-type': 'application/json',
			},
		});
	}
};

// export const config = {
// 	runtime: 'edge',
// };

export default POST;
