import {
	TDebate,
	TDebateMessage,
	TExtendedSession,
	TStreamCallback,
	TUserFromDB,
} from '@/types/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
// import {
// 	getUserInfoFromSession,
// 	selectConvByStr,
// 	selectDebate,
// 	selectDebateMessages,
// } from '@/models';
import MessageGenerator from '@/utils/messageGenerator';
import { configs } from '@/config';
import { ChatCompletionMessageParam } from 'openai/resources';
import createAIChatStream from '@/lib/createAIChat';
import {
	insertDebateMessage,
	selectDebate,
	selectDebateMessages,
} from '@/models/debate';
import { optimizingPrompt } from '@/lib/optimizingPrompt';
import { getUserInfoFromSession } from '@/models/user';
import { selectConvByStr } from '@/models/conversation';

export default async function handler(
	request: NextApiRequest,
	response: NextApiResponse,
) {
	if (request.method !== 'POST') {
		response.status(400).send('Bad request');
	}
	// response.setHeader('Content-Type', 'application/json');
	response.setHeader('X-Accel-Buffering', 'no');
	const session: TExtendedSession = await getServerSession(
		request,
		response,
		authOptions,
	);
	const user: TUserFromDB = await getUserInfoFromSession(session);
	if (!user) {
		response.status(401).send('Invalid User');
		return;
	}
	const userMessage = request.body.text;
	const convStringId = request.body.convStringId;
	const answerId = request.body.answerId;
	const debateId = request.body.debateId;
	console.log('debate id: ', debateId);
	if (!convStringId || !userMessage || !answerId || !debateId) {
		response.status(404).send('Invalid parameter');
		return;
	}
	try {
		const convIntId = (await selectConvByStr(convStringId)).id;
		const debate: TDebate = await selectDebate(answerId, user.user_id);

		const debateMessages: TDebateMessage[] = await selectDebateMessages(
			debateId,
			user.user_id,
		);
		const prompt: Array<ChatCompletionMessageParam> = [];
		prompt.push(MessageGenerator.systemMessage(debate.refer_content));
		prompt.push(MessageGenerator.userMessage(debate.question.message));
		prompt.push(MessageGenerator.assistantMessage(debate.answer.message));
		const optimizedHistory = optimizingPrompt(
			debateMessages,
			debate.refer_content,
			configs.debateTokenLimit,
		);
		prompt.concat(
			optimizedHistory.map((debateMessage) => {
				switch (debateMessage.role) {
					case 'user': {
						return MessageGenerator.userMessage(
							debateMessage.content as string,
						);
					}
					case 'assistant': {
						return MessageGenerator.assistantMessage(
							debateMessage.content ?? '',
						);
					}
					default: {
						return {
							content: '',
							role: 'user',
						};
					}
				}
			}),
		);
		prompt.push(MessageGenerator.userMessage(userMessage));
		console.log('prompt : ', prompt);
		const streamCallback: TStreamCallback = async ({
			text,
			isEnd,
			error,
		}) => {
			if (error) {
				console.log('openai error : ', error);
				response.status(500).send(error);
				return;
			}
			if (isEnd) {
				//내가 보낸 내용 insert
				await insertDebateMessage(
					userMessage,
					'user',
					debateId,
					convIntId,
					user.user_id,
				);

				//ai가 보낸 내용 insert
				await insertDebateMessage(
					text,
					'assistant',
					debateId,
					convIntId,
					user.user_id,
				);

				response.end('');
			} else {
				// res.write(text);
				console.log('write text:', text);
				response.write(text);
			}
		};
		await createAIChatStream(prompt, 'gpt-3.5-turbo-16k', streamCallback);
	} catch (error) {
		console.log('send debate error: ', error);
		response.status(500).send(error);
	}
}
