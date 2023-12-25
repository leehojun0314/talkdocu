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
		if (!completion.body) {
			return;
		}
		const reader = completion.body.getReader();

		// 사용자 정의 객체
		const myData = { additionalData: 'My custom data' };

		const newStream = new ReadableStream({
			async start(controller) {
				let responseText = '';
				let combinedData = { ...myData }; // 사용자 정의 데이터를 미리 포함

				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					let textChunk = new TextDecoder('utf-8').decode(value, {
						stream: !done,
					});

					// "data: " 접두사 제거
					// textChunk = textChunk.replace(/^data: /, '');
					console.log('textChunk: ', textChunk);
					const dataArr = textChunk.split('\n\n');

					for (let stringData of dataArr) {
						console.log('stringData: ', stringData);
						const parsedData = JSON.parse(stringData);
						console.log('parsedData: ', parsedData);
					}
					// console.log('text chunk :', textChunk);
					try {
						// 각 textChunk를 개별적으로 JSON 객체로 변환
						const chunkData = JSON.parse(textChunk);
						console.log('chunk data:', chunkData);
						// 필요한 정보를 combinedData 객체에 추가
						// 예: id, choices 등을 추가하는 방식으로
						combinedData = { ...combinedData, ...chunkData };
					} catch (e) {
						console.error('Error parsing chunk: ', e);
					}
				}

				try {
					// 최종적으로 조합된 데이터를 JSON 문자열로 변환
					const newResponseText = JSON.stringify(combinedData);

					// 새 스트림에 기록
					controller.enqueue(new TextEncoder().encode(newResponseText));
				} catch (e) {
					controller.error(e);
				}

				controller.close();
			},
		});

		return new Response(newStream, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'application/json',
				'Cache-Control': 'no-cache, no-transform',
				'X-Accel-Buffering': 'no',
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

export default POST;
