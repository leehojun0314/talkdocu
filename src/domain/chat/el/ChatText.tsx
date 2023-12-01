import { Button, CircularProgress, Stack, Typography } from '@mui/material';
import { css, jsx } from '@emotion/react';
import { Color } from '@/common/theme/colors';
import Image from 'next/image';
import profile from '@/assets/images/ai.png';
import { Mq } from '@/common/theme/screen';
import parser from 'html-react-parser';
import React, { ReactElement } from 'react';
import ForumIcon from '@mui/icons-material/Forum';
type chatFromMeType = {
	textFromMe: string | number;
	profileUrl?: string | null;
};

export const ChatFromMe = ({ textFromMe, profileUrl }: chatFromMeType) => {
	return (
		<Stack direction='row' gap='10px' css={sx.textFromMeWrap}>
			<Typography
				variant='body2'
				color={Color.BlackText}
				css={sx.textFromMe}
			>
				{textFromMe}
			</Typography>
			{profileUrl && (
				<Image
					src={profileUrl}
					alt='profile'
					width={40}
					height={40}
					style={{
						borderRadius: '20px',
					}}
				/>
			)}
		</Stack>
	);
};

function convertNewlinesToHTML(text: string) {
	return text.replace(/\n/g, '<br />');
}
export const SalutationFromAI = ({ textFromAI }: { textFromAI: string }) => {
	return (
		<Stack direction='row' gap='10px' css={sx.chatFromaIWrap}>
			<Image src={profile} alt='profile' width={40} height={40} />
			<Typography
				variant='body2'
				color={Color.WhiteText}
				css={sx.textFromAI}
			>
				{parser(convertNewlinesToHTML(textFromAI))}
				{/* {textFromAI} */}
			</Typography>
		</Stack>
	);
};
type TChatFromAIButton = {
	textFromAI: string;
	messageId: number;
	handleClickDebate: (
		messageId: number,
	) => (evt: React.MouseEvent<HTMLButtonElement>) => void;
	isLoadingDebate: boolean;
};
export const ChatFromAIButton = ({
	textFromAI,
	messageId,
	handleClickDebate,
	isLoadingDebate,
}: TChatFromAIButton) => {
	return (
		<Stack direction='row' gap='10px' css={sx.chatFromaIWrap}>
			<Image src={profile} alt='profile' width={40} height={40} />
			<Typography
				variant='body2'
				color={Color.WhiteText}
				css={sx.textFromAI}
			>
				{parser(convertNewlinesToHTML(textFromAI))}
				{/* {textFromAI} */}
			</Typography>
			<div css={sx.buttonContainer}>
				{isLoadingDebate ? (
					<CircularProgress
						size={25}
						css={css`
							justify-content: center;
							width: 50px;
							color: ${Color.WhiteText};
							margin-left: 10px;
						`}
					/>
				) : (
					<Button
						onClick={handleClickDebate(messageId)}
						css={sx.debateBtn}
					>
						<ForumIcon
							style={{
								width: '50px',
							}}
						/>
					</Button>
				)}
			</div>
		</Stack>
	);
};
export const ChatFromAI = ({ textFromAI }: { textFromAI: string }) => {
	return (
		<Stack direction='row' gap='10px' css={sx.chatFromaIWrap}>
			<Image src={profile} alt='profile' width={40} height={40} />
			<Typography
				variant='body2'
				color={Color.WhiteText}
				css={sx.textFromAI}
			>
				{parser(convertNewlinesToHTML(textFromAI))}
				{/* {textFromAI} */}
			</Typography>
		</Stack>
	);
};
function isEmptyContent(
	content: string | JSX.Element | JSX.Element[],
): boolean {
	if (typeof content === 'string') {
		return content.length === 0;
	} else if (Array.isArray(content)) {
		return content.length === 0;
	} else if (React.isValidElement(content)) {
		// JSX.Element 일 경우
		return (
			React.Children.count((content as ReactElement).props.children) === 0
		);
	} else {
		return false;
	}
}
export const AnswerFromAI = ({ textFromAI }: { textFromAI: string }) => {
	const message = parser(convertNewlinesToHTML(textFromAI));
	return (
		<Stack direction='row' gap='10px' css={sx.chatFromaIWrap}>
			<Image src={profile} alt='profile' width={40} height={40} />
			<Typography
				variant='body2'
				color={Color.WhiteText}
				css={sx.textFromAI}
			>
				{isEmptyContent(message) ? (
					<CircularProgress
						size={30}
						style={{
							color: Color.WhiteText,
						}}
					/>
				) : (
					message
				)}
			</Typography>
		</Stack>
	);
};
export const AILoadingQuestion = () => {
	return (
		<Stack direction='row' gap='10px' css={sx.chatFromaIWrap}>
			<Image src={profile} alt='profile' width={40} height={40} />
			<Stack css={sx.textFromAI}>
				<Typography variant='body2' color={Color.WhiteText}>
					Generating questions...
					<CircularProgress
						size={18}
						style={{
							color: Color.WhiteText,
						}}
					/>
				</Typography>
			</Stack>
		</Stack>
	);
};
type AIQuestionType = {
	questionsArr: string[] | undefined;
	onQuestionClick: (
		question: string,
	) => (event: React.MouseEvent<HTMLButtonElement>) => void;
	isLoading: boolean;
	questionDocName: string | null;
};

export const AIQuestion = ({
	questionsArr,
	onQuestionClick,
	isLoading,
	questionDocName,
}: AIQuestionType) => {
	return (
		<Stack direction='row' gap='10px' css={sx.chatFromaIWrap}>
			<Image src={profile} alt='profile' width={40} height={40} />
			<Stack css={sx.textFromAI}>
				<Typography variant='body2' color={Color.WhiteText}>
					{/* {textFromAI} */}
					{questionsArr?.length &&
						`Related questions for ${
							questionDocName && questionDocName
						}:`}
				</Typography>
				{questionsArr?.map((question, index) => (
					<Button
						key={index}
						css={sx.questionBtn}
						onClick={onQuestionClick(question)}
						disabled={isLoading}
					>
						<Typography variant='h4' color={Color.WhiteText}>
							{question}
						</Typography>
					</Button>
				))}
			</Stack>
		</Stack>
	);
};
const sx = {
	textFromMe: css`
		background: ${Color.chatBackground};
		border-radius: 20px 0px 20px 20px;
		padding: 10px;
		max-width: 60%;
	`,
	textFromMeWrap: css`
		justify-content: flex-end;
		padding: 20px 0;
		@media ${Mq.sm} {
			padding: 10px 0;
		}
	`,
	chatFromaIWrap: css`
		padding: 20px 0;
		@media ${Mq.sm} {
			padding: 10px 0;
		}
	`,
	textFromAI: css`
		border-radius: 0px 20px 20px 20px;
		border: solid 1px ${Color.chatBackground};
		padding: 10px;
		max-width: 60%;
	`,
	questionBtn: css`
		justify-content: flex-start;
		text-align: left;
		&:hover {
			background-color: ${Color.hoverDark};
		}
	`,
	buttonContainer: css`
		display: flex;
		align-items: center;
	`,
	debateBtn: css`
		width: 50px;
		color: ${Color.WhiteText};
		height: 50px;
		justify-content: center;
		&:hover {
			background-color: ${Color.backgroundGray};
			color: ${Color.BrandMain};
		}
	`,
};
