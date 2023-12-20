import { TExtendedSession, TStreamCallback, TUserFromDB } from '@/types/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { getUserInfoFromSession, selectConvByStr } from '@/models';
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { configs } from '@/config';
import createAIChatStream from '@/lib/createAIChat';
import MessageGenerator from '@/utils/messageGenerator';

export default async function handler(
	request: NextApiRequest,
	response: NextApiResponse,
) {
	const session: TExtendedSession = await getServerSession(
		request,
		response,
		authOptions,
	);
	const user: TUserFromDB = await getUserInfoFromSession(session);
	if (!user) {
		response.status(401).send('Invalid user');
		return;
	}
	const convStringId = request.body.convStringId;
	const userMessage = request.body.text;
	if (!convStringId || !userMessage) {
		response.status(404).send('Invalid parameter');
		return;
	}
	try {
		const convIntId = (await selectConvByStr(convStringId)).recordset[0].id;
		console.log('conv int id: ', convIntId);
		const userId = user.user_id;

		const pineconeClient = new Pinecone({
			apiKey: process.env.PINECONE_API_KEY ?? '',
			environment: process.env.PINECONE_ENVIRONMENT ?? '',
		});
		const pineconeIndex = pineconeClient.Index(
			process.env.PINECONE_INDEX ?? '',
		);
		const embeddings = new OpenAIEmbeddings();
		const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
			pineconeIndex,
		});
		const messageVector = await embeddings.embedQuery(userMessage);
		const vectorStoreResult =
			await vectorStore.similaritySearchVectorWithScore(messageVector, 10, {
				convIntId: Number(convIntId),
			});
		console.log('similarity search result: ', vectorStoreResult);
		const filteredStoreResult = vectorStoreResult.filter(
			(storeResult) => storeResult[1] > configs.vectorResultSimilarityScore,
		);
		let relatedParagraphs = filteredStoreResult.map((storeResult) => {
			return storeResult[0];
		});
		if (relatedParagraphs.length === 0) {
			relatedParagraphs = vectorStoreResult.map((storeResult) => {
				return storeResult[0];
			});
			relatedParagraphs.splice(2);
		}
		// console.log('relatedParagraphs : ', relatedParagraphs);
		const selectedParagraphs = [];
		let totalLength = 0;
		const maxLength = configs.relatedParagraphLength;
		for (const paragraph of relatedParagraphs) {
			if (totalLength + paragraph.pageContent.length <= maxLength) {
				selectedParagraphs.push(paragraph);
				totalLength += paragraph.pageContent.length;
			} else {
				// 남은 길이를 계산하고, 해당 길이만큼 잘라낸 paragraph_content를 저장합니다.
				const remainingLength = maxLength - totalLength;
				const truncatedContent = paragraph.pageContent.substring(
					0,
					remainingLength,
				);
				selectedParagraphs.push({
					...paragraph,
					pageContent: truncatedContent,
				});
				totalLength += truncatedContent.length;
				break;
			}
		}
		const relatedContent = selectedParagraphs
			.map((p) => p.pageContent)
			.join('\n');
		console.log('related Content : ', relatedContent);
		const messages = [];
		if (relatedContent) {
			messages.push(MessageGenerator.systemMessage(relatedContent));
		}
		messages.push(MessageGenerator.userMessage(userMessage));
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

				const insertQuestionRes = await insertMessage({
					message: userMessage,
					sender: 'user',
					convIntId: convIntId,
					userId: userId,
				});
				//ai가 보낸 내용 insert
				const referenceDocs = selectedParagraphs.map((p) => {
					return {
						page: p.metadata.pageNumber,
						documentName: p.metadata.docuName,
					};
				});
				const answer =
					text +
					(selectedParagraphs.length > 0
						? '\n' + referenceDocsToString(referenceDocs)
						: '');
				const insertAnswerRes = await insertMessage({
					message: answer,
					sender: 'assistant',
					convIntId: convIntId,
					userId: userId,
				});
				const questionId = insertQuestionRes.recordset[0].message_id;
				const answerId = insertAnswerRes.recordset[0].message_id;

				await insertDebate({
					questionId,
					answerId,
					referContent: relatedContent,
					convIntId,
					userId,
				});
				response.end('');
			} else {
				// res.write(text);
				response.write(
					JSON.stringify({
						text,
						referenceDocs: selectedParagraphs.map((p) => {
							return {
								page: p.metadata.pageNumber,
								documentName: p.metadata.docuName,
							};
						}),
					}) + '#',
				);
			}
		};
		await createAIChatStream(messages, 'gpt-4', streamCallback);
	} catch (error) {}
}
