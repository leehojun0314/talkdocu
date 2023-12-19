import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	res.setHeader('X-Accel-Buffering', 'no');
	res.setHeader('Content-Type', 'text/event-stream;charset=utf-8');
	res.setHeader('Cache-Control', 'no-cache, no-transform');
	try {
		const openai = new OpenAI({
			apiKey: process.env.OPENAI_API_KEY,
			organization: process.env.OPENAI_ORGANIZATION,
		});
		const completion = await openai.chat.completions.create({
			model: 'gpt-4',
			messages: [{ role: 'user', content: 'hello how are you' }],
			stream: true,
		});
		let finalText = '';
		for await (const chunk of completion) {
			if (chunk.choices[0].finish_reason === 'stop') {
				res.write(finalText);
				res.end();
				return;
			}
			const text = chunk.choices[0].delta.content;
			console.log('text:', text);
			finalText += text;
			res.write(text);
		}
	} catch (error) {
		console.log('err: ', error);
		res.status(500).send(error);
	}
}
