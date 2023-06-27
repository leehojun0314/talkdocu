import { css } from '@emotion/react';
import { Color } from '@/common/theme/colors';
import { AIQuestion, AnswerFromAI, ChatFromMe } from './el/ChatText';
import { ChatFromAI } from './el/ChatText';
import { ChatFrame } from './el/ChatFrame';
import { HeaderView } from '@/common/el/Header/HeaderView';
import character from '@/assets/images/chat_chr.png';
import Image from 'next/image';
import { Button } from '@mui/material';
import GoogleAd from '@/common/el/GoogleAds/GoogleAd';
import useChatViewV2 from './hooks/useChatView_v2';
import getConfig from 'next/config';
import { useCustomMediaQuery } from '@/common/theme/screen';
import OptionDialog from './el/OptionDialog';
import Chats from './el/Chats';
import { DebateFrame } from './el/DebateFrame';
import DebateChats from './el/DebateChats';
const { publicRuntimeConfig } = getConfig();
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
		// isLoadingQuestion,
		handleGenerateQuestion,
		documents,
		docuForQuestion,
		handleChangeDocuSelect,
		handleOptionToggle,
		optionDialog,
		chatMode,
		handleChatMode,
		handleClickDebate,
		debate,
		debateMessages,
		isLoadingDebate,
		handleSubmitDebate,
		handleScrollDebate,
		debateMessageBoxRef,
		toggleReferContent,
		isReferOpen,
	} = useChatViewV2();
	const { isLarge } = useCustomMediaQuery();
	return (
		<div css={sx.root}>
			<OptionDialog
				isOpen={optionDialog.isOpen}
				handleOptionClose={handleOptionToggle}
			/>
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
			{!isLarge ? (
				<div css={sx.container}>
					<div css={sx.ad}>
						<GoogleAd
							client={publicRuntimeConfig.ADSENSE_CLIENT}
							slot={publicRuntimeConfig.ADSENSE_SLOT}
							height='500px'
							format='auto'
							responsive='true'
						/>
					</div>
					<div css={sx.frameContainer}>
						<ChatFrame
							conversation={conversation}
							input={input}
							handleSubmit={handleSubmit}
							setInput={setInput}
							isLoading={isLoading}
							handleScroll={handleScroll}
							messageBoxRef={messageBoxRef}
							handleOptionClick={handleOptionToggle}
							chatMode={chatMode}
							handleChatMode={handleChatMode}
						>
							{/* <></> */}
							<Chats
								salutation={salutation}
								documents={documents}
								isLoading={isLoading}
								isLoadingDebate={isLoadingDebate}
								messages={messages}
								auth={auth}
								answer={answer}
								docuForQuestion={docuForQuestion}
								handleChangeDocuSelect={handleChangeDocuSelect}
								handleGenerateQuestion={handleGenerateQuestion}
								handleQuestionClick={handleQuestionClick}
								handleClickDebate={handleClickDebate}
							/>
						</ChatFrame>
						<DebateFrame
							conversation={conversation}
							input={input}
							handleSubmit={handleSubmitDebate}
							setInput={setInput}
							isLoading={isLoading}
							handleScroll={handleScrollDebate}
							messageBoxRef={debateMessageBoxRef}
							handleOptionClick={handleOptionToggle}
							chatMode={chatMode}
							handleChatMode={handleChatMode}
							debate={debate}
							isReferOpen={isReferOpen}
							toggleReferOpen={toggleReferContent}
						>
							{/* <></> */}
							<DebateChats
								debate={debate}
								messages={debateMessages}
								auth={auth}
								answer={answer}
							/>
						</DebateFrame>
					</div>

					<div css={sx.ad}>
						<GoogleAd
							client={publicRuntimeConfig.ADSENSE_CLIENT}
							slot={publicRuntimeConfig.ADSENSE_SLOT}
							format='auto'
							responsive='true'
							height='500px'
						/>
					</div>
				</div>
			) : (
				<div css={sx.frameContainer}>
					<ChatFrame
						conversation={conversation}
						input={input}
						handleSubmit={handleSubmit}
						setInput={setInput}
						isLoading={isLoading}
						handleScroll={handleScroll}
						messageBoxRef={messageBoxRef}
						handleOptionClick={handleOptionToggle}
						chatMode={chatMode}
						handleChatMode={handleChatMode}
					>
						{/* <></> */}
						<Chats
							salutation={salutation}
							documents={documents}
							isLoading={isLoading}
							isLoadingDebate={isLoadingDebate}
							messages={messages}
							auth={auth}
							answer={answer}
							docuForQuestion={docuForQuestion}
							handleChangeDocuSelect={handleChangeDocuSelect}
							handleGenerateQuestion={handleGenerateQuestion}
							handleQuestionClick={handleQuestionClick}
							handleClickDebate={handleClickDebate}
						/>
					</ChatFrame>
					<DebateFrame
						conversation={conversation}
						input={input}
						handleSubmit={handleSubmitDebate}
						setInput={setInput}
						isLoading={isLoading}
						handleScroll={handleScrollDebate}
						messageBoxRef={debateMessageBoxRef}
						handleOptionClick={handleOptionToggle}
						chatMode={chatMode}
						handleChatMode={handleChatMode}
						debate={debate}
						isReferOpen={isReferOpen}
						toggleReferOpen={toggleReferContent}
					>
						{/* <></> */}
						<DebateChats
							debate={debate}
							messages={debateMessages}
							auth={auth}
							answer={answer}
						/>
					</DebateFrame>
				</div>
			)}

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
		right: calc(50% - 30%);
		bottom: 100px;
		height: 50px;
		color: ${Color.BrandMain};
		@media (max-width: 1024px) {
			right: 5%;
		}
		z-index: 99;
	`,

	container: css`
		display: flex;
		align-items: center;
	`,

	ad: css`
		/* flex: 0.3; */
		width: 200px;
		/* position: absolute; */
	`,
	frameContainer: css`
		position: relative;
		/* max-width: 1000px; */
		flex: 2;
		margin: 0 auto;
		height: calc(100vh - 70px);
		overflow: hidden;
		width: 100%;
	`,
};
