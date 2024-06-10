import { TrootState } from '@/redux/reducers';

import React, { useCallback } from 'react';
import {
	AIQuestion,
	AnswerFromAI,
	ChatFromAI,
	ChatFromMe,
	SalutationFromAI,
} from './ChatText';
import { css } from '@emotion/react';
import { Color } from '@/common/theme/colors';
import { Session } from 'next-auth';
import { TDebate, TDebateMessage } from '@/types/types';
type TChats = {
	debate: TDebate;
	messages: TDebateMessage[];
	auth: Session | null;
	// answer: { isOpen: boolean; content: string };
	isAnswerOpen: boolean;
	answerContent: string;
};
export default function DebateChats({
	debate,
	messages,
	auth,
	isAnswerOpen,
	answerContent,
}: TChats) {
	return (
		<>
			<ChatFromMe
				textFromMe={debate.question.message}
				profileUrl={auth?.user?.image}
			/>
			<ChatFromAI textFromAI={debate.answer.message} />
			{messages?.length > 0 &&
				messages?.map((message) => {
					if (!message.content) {
						return null;
					}
					if (message.sender === 'user') {
						return (
							<ChatFromMe
								textFromMe={message.content}
								key={message.id}
								profileUrl={auth?.user?.image}
							/>
						);
					} else if (message.sender === 'assistant') {
						return (
							<ChatFromAI
								textFromAI={message.content}
								key={message.id}
							/>
						);
					} else {
						return <></>;
					}
				})}

			{isAnswerOpen && <AnswerFromAI textFromAI={answerContent} />}
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
