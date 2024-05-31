// import fs from 'fs';
import { Configuration, OpenAIApi } from 'openai-edge';
export const runtime = 'edge';
import {
	createParser,
	EventSourceParser,
	ParsedEvent,
} from 'eventsource-parser';
import chunkToText from '@/utils/chunkToText';
export default async function GET() {
	try {
		const configuration = new Configuration({
			apiKey: process.env.OPENAI_API_KEY,
			organization: process.env.OPENAI_ORGANIZATION,
		});
		const openai = new OpenAIApi(configuration);
		const openaiRes = await openai.createChatCompletion({
			model: 'gpt-4',
			messages: [{ role: 'user', content: '안녕하세요' }],
			temperature: 0.7,
			stream: true,
		});

		let eventSourceParser: EventSourceParser;
		const parser = (data: ParsedEvent['data']) => {
			const extract = chunkToText();
			return extract(JSON.parse(data));
		};
		const textDecoder = new TextDecoder();
		const textEncoder = new TextEncoder();
		const transformStream = new TransformStream({
			async start(controller) {
				console.log('start called');
				eventSourceParser = createParser(function onParse(event: any) {
					console.log('on parse: ', event);
					if (
						('data' in event &&
							event.type === 'event' &&
							event.data === '[DONE]') || // Replicate doesn't send [DONE] but does send a 'done' event
						// @see https://replicate.com/docs/streaming
						event.event === 'done'
					) {
						controller.terminate();
						return;
					}
					if ('data' in event) {
						const parsedMessage = parser(event.data);
						console.log('parsed message: ', parsedMessage);
						if (parsedMessage) {
							console.log('enqueue parsed message');
							controller.enqueue(parsedMessage);
						}
					}
				});
			},

			transform(chunk) {
				console.log(
					'decoded chunk: ',
					textDecoder.decode(chunk, { stream: true }),
				);
				eventSourceParser.feed(textDecoder.decode(chunk, { stream: true }));
			},
		});
		if (!openaiRes.body) {
			return new Response('no body');
		}
		console.log('flag 2');

		const transformStream2 = new TransformStream({
			start() {},
			transform(message, controller) {
				console.log('message before encode: ', message);
				controller.enqueue(textEncoder.encode(message));
			},
		});
		const newReadable = openaiRes.body
			.pipeThrough(transformStream)
			.pipeThrough(transformStream2);
		return new Response(newReadable, {
			headers: {
				'Content-Type': 'text/plain; charset=utf-8',
				'X-Accel-Buffering': 'true',
				// 'Transfer-Encoding': 'chunked',
			},
		});
		// if (Symbol.asyncIterator in openaiRes) {
		// 	console.log('flag 3');
		// 	const textStream = readableFromAsyncIterable(streamable(openaiRes))
		// 		.pipeThrough(createCallbacksTransformer(void 0))
		// 		.pipeThrough(createStreamDataTransformer(void 0));
		// 	// console.log('it is iterable');
		// 	// const newStream = openaiRes.body.pipeThrough(transformStream);
		// 	// // readStream.on('data', (chunk) => {
		// 	// // 	data.push(chunk);
		// 	// // 	console.log('data: ', chunk, chunk.length);
		// 	// // });
		// 	return new Response(textStream, {
		// 		headers: {
		// 			'Content-Type': 'text/plain; charset=utf-8',
		// 			'X-Experimental-Stream-Data': 'true',
		// 		},
		// 	});
		// } else {
		// 	console.log('flag 4');
		// 	console.log('not iterable body');
		// 	return new Response('not iterable body');
		// }
	} catch (error) {
		console.log('error: ', error);
	}
}
