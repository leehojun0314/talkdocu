import getConfig from 'next/config';
import {
	Button,
	CircularProgress,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import Image from 'next/image';
import { Color } from '@/common/theme/colors';
import { css } from '@emotion/react';
import menu from '@/assets/icons/menu.png';
import send from '@/assets/icons/send.png';
import { RefObject, useState } from 'react';
import { Mq, useCustomMediaQuery } from '@/common/theme/screen';
import { ConversationDialog } from './ConversationDialog';
import GoogleAd from '@/common/el/GoogleAds/GoogleAd';
import TuneIcon from '@mui/icons-material/Tune';
const { publicRuntimeConfig } = getConfig();
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ImportContactsIcon from '@mui/icons-material/ImportContacts';
import ReferDialog from './ReferDialog';
import { TChatMode, TConversation, TDebate } from '@/types/types';
type TDebateFrame = {
	children: React.ReactElement;
	conversation: TConversation | undefined;
	input: string;
	setInput: (content: string) => void;
	handleSubmit: (input: string) => void;
	isLoading: boolean;
	handleScroll: (event: React.UIEvent<HTMLDivElement>) => void;
	messageBoxRef: RefObject<HTMLDivElement>;
	handleOptionClick: (event: React.MouseEvent<HTMLDivElement>) => void;
	chatMode: 'QA' | 'Debate';
	handleChatMode: (
		chatMode: TChatMode,
	) => (evt: React.MouseEvent<HTMLButtonElement>) => void;
	debate: TDebate;
	isReferOpen: boolean;
	toggleReferOpen: () => void;
};

export const DebateFrame = ({
	children,
	input,
	setInput,
	handleSubmit,
	isLoading,
	handleScroll,
	messageBoxRef,
	chatMode,
	handleChatMode,
	debate,
	isReferOpen,
	toggleReferOpen,
}: TDebateFrame) => {
	const [open, setOpen] = useState(false);
	const handleClickOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};

	const { isLarge } = useCustomMediaQuery();
	return (
		<Stack css={sx.chat(chatMode)} className={'slide1 ' + chatMode}>
			{/* <UploadDialog open={open} onClose={handleClose}></UploadDialog> */}
			{!isLoading && (
				<ConversationDialog open={open} onClose={handleClose} />
			)}
			{!isLoading && (
				<ReferDialog
					isOpen={isReferOpen}
					handleClose={toggleReferOpen}
					content={debate.refer_content}
				/>
			)}
			<Stack css={sx.topChat} direction='row' justifyContent='space-between'>
				<Stack direction='row' alignItems='center' gap='13px'>
					{/* <Button css={sx.menuBtn} onClick={handleClickOpen}>
						<Image src={menu} alt='menu' width={18} height={18} />
					</Button> */}
					{isLoading ? (
						<CircularProgress
							size={25}
							style={{
								color: Color.WhiteText,
							}}
						/>
					) : (
						<Button css={sx.menuBtn} onClick={handleChatMode('QA')}>
							<ArrowBackIcon
								style={{
									fontSize: 'large',
									color: Color.WhiteText,
								}}
							/>
						</Button>
					)}

					<Typography color={Color.WhiteText}>
						{/* {conversation?.conversation_name} */}
						Debate id : {debate.debate_id}
					</Typography>
					{/* <Button onClick={handleChatMode('QA')}>test</Button> */}
				</Stack>
				<div css={sx.optionBtn} onClick={toggleReferOpen}>
					{/* <TuneIcon fontSize='medium' /> */}
					<ImportContactsIcon fontSize='medium' />
				</div>
				{/* <Stack
					style={{
						display: 'flex',
						flexDirection: 'row',
					}}
				> */}

				{/* <Stack
						style={{
							justifyContent: 'center',
							marginRight: '10px',
						}}
					>
						<select css={sx.chatModeSelect}>
							<option>Document Analysis</option>
							<option>Conversation Inference</option>
						</select>
					</Stack> */}
				{/* <Stack
						alignItems={'center'}
						justifyContent={'center'}
						style={{
							marginRight: '20px',
						}}
					>
						<Typography color={Color.WhiteText}>
							ID : {conversation?.conversation_id}
						</Typography>
					</Stack> */}
				{/* <Button css={sx.pdfButton}>
						<a href={conversation?.fileUrl} target={'_blank'}>
							<Stack
								css={sx.openFile}
								direction='row'
								alignItems='center'
								gap='12px'
							>
								{isSmall ? null : (
									<Typography color={Color.WhiteText}>
										{'PDF Viewer'}
									</Typography>
								)}
								<Image
									src={openIcon}
									alt='open'
									width={16}
									height={16}
								/>
							</Stack>
						</a>
					</Button> */}
				{/* </Stack> */}
			</Stack>
			{/* {isLarge && (
				<GoogleAd
					client={publicRuntimeConfig.ADSENSE_CLIENT}
					slot={publicRuntimeConfig.ADSENSE_SLOT}
					format='auto'
					responsive='true'
					height='100px'
				/>
			)}
		 */}
			<div css={sx.chatContent} onWheel={handleScroll} ref={messageBoxRef}>
				{/* <div css={sx.chatContent} onScroll={handleScroll}> */}
				{children}
			</div>
			<div css={sx.chatBottom}>
				<TextField
					css={sx.message}
					multiline
					variant='standard'
					placeholder='Please input your question here'
					InputProps={{
						disableUnderline: true,
						style: { color: 'white' },
					}}
					value={input}
					onKeyDown={(evt) => {
						if (evt.key === 'Enter') {
							if (!isLoading) {
								handleSubmit(input);
								setInput('');
							}
						}
					}}
					onChange={(evt) => {
						if (!isLoading) {
							const text = evt.currentTarget.value;
							setInput(text);
						}
					}}
					disabled={isLoading}
				/>
				<Button
					css={sx.sendbtn}
					onClick={() => {
						if (!isLoading) {
							handleSubmit(input);
							setInput('');
						}
					}}
					disabled={isLoading}
				>
					{isLoading ? (
						<CircularProgress
							size={20}
							style={{
								color: Color.WhiteText,
							}}
						/>
					) : (
						<div css={sx.send}>
							<Image src={send} alt='send' width={24} height={24} />
						</div>
					)}
				</Button>
			</div>
		</Stack>
	);
};

const sx = {
	// chat: css`
	// 	flex: 2;
	// 	max-width: 1000px;
	// 	margin: 0 auto;
	// 	height: calc(100vh - 70px);
	// 	/* for ani */
	// 	position: absolute;
	// 	transition: transform 0.2s ease;
	// `,
	chat: (chatMode: 'QA' | 'Debate') => {
		return css`
			/* flex: 2; */
			max-width: 1024px;
			min-width: 100%;
			/* margin: 0 auto; */
			height: calc(100vh - 70px);
			/* for ani */
			position: absolute;
			transition: transform 0.2s ease;
			transform: ${chatMode === 'Debate' ? '' : 'translateX(100%)'};
		`;
	},
	topChat: css`
		border: solid 1px #fff;
		padding-left: 10px;
		padding-right: 5px;
		height: 64px;
	`,
	menuBtn: css`
		min-width: 45px;
		height: 35px;
		&:hover {
			background-color: ${Color.hoverDark};
		}
	`,
	pdfButton: css`
		padding: 0;
		min-width: fit-content;
		&:hover {
			background-color: transparent;
		}
	`,
	openFile: css`
		border-left: solid 1px #fff;
		height: 100%;
		padding: 17px 20px 17px 20px;
	`,
	chatContent: css`
		padding: 60px;
		border-left: solid 1px #fff;
		border-right: solid 1px #fff;
		overflow-y: scroll;
		height: 100%;
		/* width: 100%; */
		::-webkit-scrollbar {
			background-color: transparent;
			width: 20px;
		}
		::-webkit-scrollbar-thumb {
			border: 7px solid rgba(0, 0, 0, 0);
			background-clip: padding-box;
			border-radius: 999px;
			background-color: rgba(255, 255, 255, 0.6);
		}

		@media ${Mq.sm} {
			padding: 40px 20px 120px 20px;
		}
	`,
	chatBottom: css`
		border: solid 1px #fff;
		padding-left: 20px;
		display: grid;
		grid-template-columns: auto 64px;
		grid-template-rows: auto;
	`,
	message: css`
		width: 100%;
		outline: none;
		padding-right: 20px;
		display: flex;
		flex-direction: column;
		height: 100%;
		justify-content: center;
	`,
	send: css`
		padding: 20px;
		height: 100%;
		border-left: solid 1px #fff;
		width: 63.99px;
		flex: 1;
		display: flex;
		align-items: center;
	`,
	sendbtn: css`
		min-width: fit-content;
		padding: 0;
		&:hover {
			background-color: ${Color.hoverDark};
		}
	`,

	optionBtn: css`
		display: flex;
		min-width: 45px;
		justify-content: center;
		align-items: center;
		color: ${Color.WhiteText};
		padding: 6px;
		margin: 7px;
		border-radius: 5px;
		cursor: pointer;
		&:hover {
			background-color: ${Color.hoverDark};
		}
		transition: 250ms;
	`,
};
