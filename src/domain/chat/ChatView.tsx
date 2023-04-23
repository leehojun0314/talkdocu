import { css } from '@emotion/react';
import { Color } from '@/common/theme/colors';
import { AIQuestion, ChatFromMe } from './el/ChatText';
import { ChatFromAI } from './el/ChatText';
import { ChatFrame } from './el/ChatFrame';
import { HeaderView } from '@/common/el/Header/HeaderView';
import character from '@/assets/images/chat_chr.png';
import Image from 'next/image';
import { QuestionModels } from './el/model';
import useChatView, { Tquestion } from './hooks/useChatView';
import { Button } from '@mui/material';
import GoogleAd from '@/common/el/GoogleAds/GoogleAd';

export const ChatView = () => {
	const {
		auth,
		conversation,
		messages,
		questions,
		answer,
		input,
		messageBoxRef,
		handleSubmit,
		setInput,
		handleQuestionClick,
		scrollToTop,
	} = useChatView();

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
			>
				<div ref={messageBoxRef}>
					{conversation?.salutation && (
						<ChatFromAI textFromAI={conversation?.salutation} />
					)}
					{questions?.length ? (
						<AIQuestion
							questions={questions}
							onQuestionClick={handleQuestionClick}
						/>
					) : (
						''
					)}

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
									return (
										<ChatFromAI
											textFromAI={message.message}
											key={message.message_id}
										/>
									);
								} else {
									return <></>;
								}
						  })
						: ''}

					{answer.isOpen && <ChatFromAI textFromAI={answer.content} />}
				</div>
			</ChatFrame>
			<GoogleAd />
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
};
