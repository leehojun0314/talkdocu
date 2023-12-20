import { TrootState } from '@/redux/reducers';
import React, { useCallback } from 'react';
import {
	AIQuestion,
	AnswerFromAI,
	ChatFromAI,
	ChatFromAIButton,
	ChatFromMe,
	SalutationFromAI,
} from './ChatText';
import { css } from '@emotion/react';
import { Color } from '@/common/theme/colors';
import { Session } from 'next-auth';
import { TDocument, TMessage } from '@/types/types';
type TChats = {
	salutation: string | undefined;
	documents: TDocument[];
	isLoading: boolean;
	isLoadingDebate: boolean;
	messages: TMessage[];
	auth: Session | null;
	answer: { isOpen: boolean; content: string };
	docuForQuestion: number | undefined;
	handleGenerateQuestion: (event: React.MouseEvent<HTMLButtonElement>) => void;
	handleChangeDocuSelect: (
		event: React.ChangeEvent<HTMLSelectElement>,
	) => void;
	handleQuestionClick: (
		question: string,
	) => (event: React.MouseEvent<HTMLButtonElement>) => void;
	handleClickDebate: (
		messageId: number,
	) => (evt: React.MouseEvent<HTMLButtonElement>) => void;
};
export default function Chats({
	salutation,
	documents,
	isLoading,
	isLoadingDebate,
	messages,
	auth,
	answer,
	docuForQuestion,
	handleGenerateQuestion,
	handleChangeDocuSelect,
	handleQuestionClick,
	handleClickDebate,
}: TChats) {
	const stopDefault = useCallback(
		(evt: React.MouseEvent<HTMLSelectElement>) => {
			evt.stopPropagation();
			evt.preventDefault();
		},
		[],
	);
	console.log('messages in Chats: ', messages);
	return (
		<>
			{salutation && <SalutationFromAI textFromAI={salutation} />}
			{documents.length > 0 && (
				<button
					onClick={handleGenerateQuestion}
					css={sx.createQuestionBtn}
					disabled={isLoading}
				>
					Create related question for: &nbsp;
					<select
						onClick={stopDefault}
						value={docuForQuestion}
						onChange={handleChangeDocuSelect}
						css={sx.docuSelect}
					>
						{documents.map((document, index) => {
							return (
								<option key={index} value={document.document_id}>
									{document.document_name}
								</option>
							);
						})}
					</select>
				</button>
			)}
			{messages?.length > 0 &&
				messages?.map((message) => {
					if (!message.message) {
						return null;
					}
					if (message.sender === 'user') {
						return (
							<ChatFromMe
								textFromMe={message.message}
								key={message.message_id}
								profileUrl={auth?.user?.image}
							/>
						);
					} else if (message.sender === 'assistant') {
						if (message.is_question) {
							console.log('message is question : ', message);
							return (
								<AIQuestion
									key={message.message_id}
									questionsArr={message.message?.split('\n')}
									onQuestionClick={handleQuestionClick}
									isLoading={isLoading}
									questionDocName={message.question_doc_name}
								/>
							);
						} else {
							return (
								<ChatFromAIButton
									textFromAI={message.message}
									messageId={message.message_id}
									handleClickDebate={handleClickDebate}
									isLoadingDebate={isLoadingDebate}
									key={message.message_id}
								/>
							);
						}
					} else {
						return <></>;
					}
				})}

			{answer.isOpen && <AnswerFromAI textFromAI={answer.content} />}
		</>
	);
}
const sx = {
	createQuestionBtn: css`
		color: ${Color.BrandMain};
		background-color: ${Color.chatBackground};
		/* padding: 8px; */
		border-radius: 8px;
		box-shadow: none;
		text-transform: none;
		font-size: 16px;
		padding: 9px 12px;
		border: 1px solid;
		line-height: 1.5px;
		/* background-color: #0063cc; */
		border: none;
		cursor: pointer;
		&:hover {
			background-color: #f7ebfca6;
		}
		&:disabled {
			background-color: #f7ebfca6;
			cursor: progress;
		}
		@media (max-width: 368px) {
			padding-top: 20px;
		}
	`,
	docuSelect: css`
		width: 80px;
		overflow-x: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		height: 33px;
		@media (max-width: 368px) {
			margin-top: 10px;
			width: 150px;
		}
	`,
};
