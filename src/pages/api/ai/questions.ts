import { configs } from '@/config';
import { TExtendedSession, TStreamCallback, TUserFromDB } from '@/types/types';
import { getUserInfoFromSession, selectConvByStr, selectUser } from '@/models';
import { NextApiRequest, NextApiResponse } from 'next';
import { selectParagraph } from '@/models/paragraph';
import { selectDocument } from '@/models/document';
import { insertQuestion } from '@/models/message';
import createAIChatStream from '@/lib/createAIChat';
import MessageGenerator from '@/utils/messageGenerator';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
export default async function hanlder(
	request: NextApiRequest,
	response: NextApiResponse,
) {
	if (request.method !== 'POST') {
		response.status(404).send('bad request');
		return;
	}
	// response.setHeader('Content-Type', 'application/json');
	response.setHeader('Content-Type', 'text/event-stream;charset=utf-8');
	response.setHeader('X-Accel-Buffering', 'no');
	response.setHeader('Transfer-Encoding', 'chunked');

	try {
		// const jwt = await getToken({ req: request });
		const session: TExtendedSession = await getServerSession(
			request,
			response,
			authOptions,
		);
		const user: TUserFromDB = await getUserInfoFromSession(session);
		console.log('user : ', user);
		// const body = await request.json();
		const body = request.body;
		console.log('body: ', body);
		const convStringId = body.convStringId;
		const docuId = body.docuId;
		const convIntIdRes = await selectConvByStr(convStringId);
		const convIntId = convIntIdRes.recordset[0].id;
		console.log('conv int id: ', convIntId);
		console.log('docu id: ', docuId);
		const selectParaRes = await selectParagraph(docuId, convIntId);
		const paragraphs = selectParaRes.recordset;
		console.log('paragraphs: ', paragraphs);
		//지문 추출
		const joinedParagraph = paragraphs
			.map((p) => p.paragraph_content)
			.join(' ')
			.slice(0, configs.relatedParagraphLength);
		const docuRes = await selectDocument(docuId, convIntId);
		console.log('docu Res:', docuRes);

		const questionStreamCallback: TStreamCallback = async ({
			text,
			isEnd,
			error,
		}) => {
			if (error) {
				console.log('question stream error: ', error);
				response.status(500).send(error);
				throw new Error('question stream error');
			}
			if (isEnd) {
				console.log('is end');
				console.log({
					convIntId,
					text,
					userId: user.user_id,
					docuId,
				});
				response.end('');
				await insertQuestion(convIntId, text, user.user_id, docuId);
			} else {
				console.log('text: ', text);
				const writeFinal =
					JSON.stringify({
						text,
						documentName: docuRes.recordset[0].document_name,
					}) + '#';
				console.log('write final : ', writeFinal);
				response.write(
					JSON.stringify({
						text,
						documentName: docuRes.recordset[0].document_name,
					}) + '#',
				);
			}
		};
		const prompt = MessageGenerator.presetQuestion(joinedParagraph);

		await createAIChatStream(
			[prompt],
			'gpt-3.5-turbo',
			questionStreamCallback,
		);
	} catch (error) {
		console.log('error: ', error);
		response.status(500).send(error);
	}
}
