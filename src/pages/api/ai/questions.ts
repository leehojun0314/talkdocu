import { Configuration, OpenAIApi } from 'openai-edge';
const configuration = new Configuration({
	apiKey: process.env.OPENAI_API_KEY,
	organization: process.env.OPENAI_ORGANIZATION,
});
// import jsonwebtoken from 'jsonwebtoken';
import {
	OpenAIStream,
	StreamingTextResponse,
	experimental_StreamData,
} from 'ai';
import * as jose from 'jose';
import { extractToken } from '@/utils/functions';
import { selectConvByStr, selectUser, sqlConnectionPool } from '@/models';
import { selectParagraph } from '@/models/paragraph';
import { configs } from '@/config';
import { selectDocument } from '@/models/document';
import prompts from '@/utils/prompts';
import { insertQuestion } from '@/models/message';
import { TProvider, TUserFromDB } from '@/types/types';
import { JWT, decode } from 'next-auth/jwt';
export const runtime = 'edge';
export default async function POST(request: Request) {
	try {
		const jwt = extractToken(request.headers.get('cookie'));
		if (!jwt) {
			return new Response('You have missed JWT', { status: 401 });
		}
		console.log('jwt before decode:', jwt);
		const decodedJWT: JWT | null = await decode({
			token: jwt ?? '',
			secret: process.env.NEXTAUTH_SECRET ?? '',
		});
		console.log('decodedJWT: ', decodedJWT);
		if (!decodedJWT) {
			return new Response('Invalid JWT', { status: 401 });
		}

		// const userRes = await selectUser(
		// 	decodedJWT.email!,
		// 	decodedJWT.provider as TProvider,
		// );
		const userRes = await (await sqlConnectionPool.connect())
			.request()
			.query(
				`SELECT * FROM UserTable WHERE user_email = '${decodedJWT.email}' AND auth_type = '${decodedJWT.provider}'`,
			);
		const user: TUserFromDB = userRes.recordset[0];
		console.log('user : ', user);
		// const body = await request.json();
		// const convStringId = body.convStringId;
		// const docuId = body.docuId;
		// const convIntIdRes = await selectConvByStr(convStringId);
		// const convIntId = convIntIdRes.recordset[0].id;
		// console.log('conv int id: ', convIntId);
		// const selectParaRes = await selectParagraph(docuId, convIntId);
		// const paragraphs = selectParaRes.recordset;
		// console.log('paragraphs: ', paragraphs);
		// //지문 추출
		// const joinedParagraph = paragraphs
		// 	.map((p) => p.paragraph_content)
		// 	.join(' ')
		// 	.slice(0, configs.relatedParagraphLength);
		// const docuRes = await selectDocument(docuId, convIntId);
		// console.log('docu Res:', docuRes);

		const openai = new OpenAIApi(configuration);
		// const res = await openai.createChatCompletion({
		// 	model: 'gpt-4-1106-preview',
		// 	messages: [prompts.presetQuestion(joinedParagraph)],
		// 	temperature: 0.7,
		// 	stream: true,
		// });
		const res = await openai.createChatCompletion({
			model: 'gpt-4-1106-preview',
			messages: [
				{
					role: 'user',
					content: 'hi',
				},
			],
			temperature: 0.7,
			stream: true,
		});
		const data = new experimental_StreamData();
		// data.append({ question_doc_name: docuRes.recordset[0].document_name });
		data.append({ question_doc_name: 'test' });
		const stream = OpenAIStream(res, {
			async onFinal(completion) {
				console.log('on final completion : ', completion);
				data.close();
				// insertQuestion(convIntId, completion);
			},
			experimental_streamData: true,
		});
		return new StreamingTextResponse(stream, undefined, data);
	} catch (error) {
		console.log('error: ', error);
		return new Response('Error', {
			status: 500,
		});
	}
}
