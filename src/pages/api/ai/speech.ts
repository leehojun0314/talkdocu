import { getUserInfoEdge } from '@/utils/getUserInfoEdge';
import MessageGenerator from '@/utils/messageGenerator';
import { createMessageTransformer } from '@/utils/transformers';

import {
	ChatCompletionRequestMessage,
	Configuration,
	OpenAIApi,
} from 'openai-edge';
export const runtime = 'edge';
export default async function GET(request: Request) {
	try {
		const userInfo = await getUserInfoEdge(request);
		if (!userInfo) {
			return new Response('Invalid user', {
				status: 401,
			});
		}
		// const body = await request.json()
		const params = new URL(request.url).searchParams;
		const convStringId = params.get('convStringId');
		const questionText = params.get('prompt');
		console.log('conv string id: ', convStringId);
		console.log('prompt: ', questionText);
		if (!convStringId || !questionText) {
			return new Response('Invalid parameter', { status: 400 });
		}
		const paraRes = await fetch(
			process.env.API_ENDPOINT + '/api/paragraph/getParagraphFromEdge',
			{
				method: 'POST',
				body: JSON.stringify({
					convStringId,
					text: questionText,
					userEmail: userInfo.email,
					userProvider: userInfo.provider,
				}),
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);
		const paraData = await paraRes.json();
		console.log('para data: ', paraData);
		const { relatedContent } = paraData;
		const prompt = MessageGenerator.systemMessage(relatedContent);
		const messages: ChatCompletionRequestMessage[] = [];
		messages.push({
			role: 'system',
			content: prompt.content as string,
		});
		messages.push({
			role: 'user',
			content: questionText,
		});
		const configuration = new Configuration({
			apiKey: process.env.OPENAI_API_KEY,
			organization: process.env.OPENAI_ORGANIZATION,
		});
		const openai = new OpenAIApi(configuration);
		const openaiRes = await openai.createChatCompletion({
			model: 'gpt-4',
			messages,
			temperature: 0.7,
			stream: true,
		});
		let accumulatedText = '';
		const specialChars = /[!.?]+/;

		const accumulateTextTransformer = new TransformStream({
			start() {},
			transform(token, controller) {
				accumulatedText += token;
				let lastCut = 0;
				for (let i = 0; i < accumulatedText.length; i++) {
					if (specialChars.test(accumulatedText[i])) {
						const sentence = accumulatedText.substring(lastCut, i + 1);
						lastCut = i + 1;
						controller.enqueue(sentence);
					}
				}
				accumulatedText = accumulatedText.substring(lastCut);
			},
			flush(controller) {
				controller.terminate();
			},
		});
		const generateAudioTransformer = new TransformStream({
			start() {},
			async transform(sentence, controller) {
				console.log('sentence: ', sentence);
				const audioRes = await generateAudio(sentence);
				const reader = audioRes?.getReader();
				while (true) {
					const readerRes = await reader?.read();
					if (readerRes?.done) {
						break;
					}
					controller.enqueue(readerRes?.value);
				}
			},
			flush(controller) {
				console.log('flush called');
				controller.terminate();
			},
		});
		const concatenatedAudioStream = openaiRes.body
			?.pipeThrough(createMessageTransformer())
			.pipeThrough(accumulateTextTransformer)
			.pipeThrough(generateAudioTransformer);
		// const stream = OpenAIStream(openaiRes, {
		// 	onToken(token) {
		// 		console.log('token :', token);
		// 		//TODO : 토큰을 저장해서 text-to-speech를 호출할 만큼의 문장 생성
		// 		//TODO : 토큰에 콤마나 full stop이 있다면 그것을 기준으로 문자열을 쪼개서 콤마 앞쪽은 더해주고 나머지 뒤쪽은 나중에 넣음.
		// 		console.log('flag 1');
		// 		accumulatedText += token;
		// 		let lastCut = 0;
		// 		for (let i = 0; i < accumulatedText.length; i++) {
		// 			if (specialChars.test(accumulatedText[i])) {
		// 				const sentence = accumulatedText.substring(lastCut, i + 1);
		// 				lastCut = i + 1;

		// 				// sentences.push();
		// 				// promises.push(generateAudio(sentence))
		// 				//TODO : 문장이 생성 되었으면 generateAudio 함수 호출해서 오디오 생성
		// 				// const newReadableStream = new ReadableStream({
		// 				// 	async start(controller) {
		// 				// 		const reader = (
		// 				// 			await generateAudio(sentence)
		// 				// 		)?.getReader();
		// 				// 		if (reader) {
		// 				// 			while (true) {
		// 				// 				const { done, value } = await reader.read();
		// 				// 				if (done) {
		// 				// 					controller.close();
		// 				// 				}
		// 				// 				controller.enqueue(value);
		// 				// 			}
		// 				// 		} else {
		// 				// 			controller.close();
		// 				// 		}
		// 				// 	},
		// 				// });
		// 				//TODO : 오디오 생성 함수를 호출한 순서대로 newResponse로 전달해서 클라이언트로 스트림형태로 전달.
		// 				// readableStreams.push(newReadableStream);
		// 				// const newReadable = newReadableStream.pipeThrough(concatenatedStream,{})
		// 				//앞의 오디오가 다 전달 되기 전까지는 대기 해놓고 앞의 오디오가 다 전달 되면 바로 이어서 전달.
		// 			}
		// 		}
		// 		accumulatedText = accumulatedText.substring(lastCut);
		// 	},
		// 	async onFinal(completion) {
		// 		console.log('on final: ', completion);
		// 		// console.log('sentences: ', sentences);
		// 	},
		// });

		const newResponse = new Response(concatenatedAudioStream, {
			headers: {
				'Content-Type': 'audio/mpeg',
				'Transfer-Encoding': 'chunked',
			},
		});
		// newResponse.headers =
		// const readableStream = new ReadableStream();
		// console.log('readable stream: ', readableStream);
		// const readStream = fs.createReadStream('');

		// readableStream.pipeTo(newResponse)

		return newResponse;
	} catch (error) {
		console.log('speech api error: ', error);
	}
}

async function generateAudio(text: string) {
	const openaiRes = await fetch('https://api.openai.com/v1/audio/speech', {
		method: 'POST',
		body: JSON.stringify({
			model: 'tts-1',
			input: text,
			voice: 'nova',
		}),
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
		},
	});
	return openaiRes.body;
	// if(!openaiRes.ok) throw openaiRes.body
	// if(!openaiRes.body)return null
	// const body =openaiRes.body
	// const reader = body.getReader()
	// while(true){
	//     const {done , value} = await reader.read()
	//     if(done){

	//         break;
	//     }
	// }
}
