import { css } from '@emotion/react';
import { Color } from '@/common/theme/colors';
import {
	AILoadingQuestion,
	AIQuestion,
	AnswerFromAI,
	ChatFromMe,
} from './el/ChatText';
import { ChatFromAI } from './el/ChatText';
import { ChatFrame } from './el/ChatFrame';
import { HeaderView } from '@/common/el/Header/HeaderView';
import character from '@/assets/images/chat_chr.png';
import Image from 'next/image';
import { QuestionModels } from './el/model';
import useChatView, { Tquestion } from './hooks/useChatView';
import {
	Button,
	FormControl,
	InputLabel,
	MenuItem,
	Select,
} from '@mui/material';
import GoogleAd from '@/common/el/GoogleAds/GoogleAd';
import useChatViewV2 from './hooks/useChatView_v2';

export const ChatView = () => {
	const {
		auth,
		conversation,
		messages,
		// questions,
		answer,
		input,
		messageBoxRef,
		handleSubmit,
		setInput,
		handleQuestionClick,
		scrollToTop,
		isLoading,
		handleScroll,
		salutation,
		// isQuestionBtn,
		isLoadingQuestion,
		handleGenerateQuestion,
		documents,
		docuForQuestion,
		handleChangeDocuSelect,
	} = useChatViewV2();

	return (
		<div css={sx.root}>
			<Image
				css={sx.chr}
				src={character}
				alt='character'
				width={300}
				height={270}
			/>
			<HeaderView />
			<Button onClick={scrollToTop} css={sx.scrollTopBtn}>
				Top
			</Button>
			<ChatFrame
				conversation={conversation}
				input={input}
				handleSubmit={handleSubmit}
				setInput={setInput}
				isLoading={isLoading}
				handleScroll={handleScroll}
				messageBoxRef={messageBoxRef}
			>
				<>
					{salutation && <ChatFromAI textFromAI={salutation} />}
					{/* {isQuestionBtn && (
						<Button
							onClick={handleGenerateQuestion}
							style={{
								color: Color.BrandMain,
								backgroundColor: Color.chatBackground,
								marginLeft: '50px',
							}}
						>
							Create Related Question
							<Select>
								
							</Select>
						</Button>
					)} */}
					{documents.length > 0 && (
						<button
							onClick={handleGenerateQuestion}
							css={sx.createQuestionBtn}
							disabled={isLoading}
						>
							Create related question for: &nbsp;
							<select
								onClick={(evt) => {
									evt.preventDefault();
									evt.stopPropagation();
								}}
								value={docuForQuestion}
								onChange={handleChangeDocuSelect}
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

					{/* {isLoadingQuestion && <AILoadingQuestion />} */}
					{/* {questions?.length ? (
						<AIQuestion
							questionsArr={questions}
							onQuestionClick={handleQuestionClick}
							isLoading={isLoading}
						/>
					) : (
						''
					)} */}

					{messages?.length
						? messages?.map((message) => {
								if (message.sender === 'user') {
									return (
										<ChatFromMe
											textFromMe={message.message}
											key={message.message_id}
											profileUrl={auth?.userData?.profile_img}
										/>
									);
								} else if (message.sender === 'assistant') {
									if (message.is_question) {
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
											<ChatFromAI
												textFromAI={message.message}
												key={message.message_id}
											/>
										);
									}
								} else {
									return <></>;
								}
						  })
						: ''}

					{answer.isOpen && <AnswerFromAI textFromAI={answer.content} />}
					{/* </div> */}
				</>
			</ChatFrame>
			{/* <GoogleAd /> */}
		</div>
	);
};

const sx = {
	root: css`
		background-image: url(/assets/bg/chat_bg.png);
		background-size: cover;
		height: 100vh;
		background-position: center;
		padding-top: 70px;
		position: relative;
	`,
	chr: css`
		position: absolute;
		bottom: 6%;
		left: 78.698vw;
		@media (max-width: 1760px) {
			display: none;
		}
	`,
	chatBottom: css`
		border: solid 1px #fff;
		padding-left: 20px;
	`,
	message: css`
		&::placeholder {
			color: ${Color.WhiteText} !important;
		}
	`,
	send: css`
		padding: 20px;
		height: 100%;
		border-left: solid 1px #fff;
	`,
	scrollTopBtn: css`
		background-color: white;
		position: fixed;
		right: calc(50% - 450px);
		bottom: 100px;
		height: 50px;
		color: ${Color.BrandMain};
		@media (max-width: 1000px) {
			right: 5%;
		}
	`,
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
	`,
	docuSelect: css`
		font-size: 0.875rem;
		height: 30px;
		width: 100px;
	`,
};
