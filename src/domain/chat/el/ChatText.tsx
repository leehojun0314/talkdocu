import { Button, Stack, Typography } from '@mui/material';
import { css } from '@emotion/react';
import { Color } from '@/common/theme/colors';
import Image from 'next/image';
import profile from '@/assets/images/ai.png';
import { Mq } from '@/common/theme/screen';
import { Tquestion } from '../hooks/useChatView';
import parser from 'html-react-parser';
type chatFromMeType = {
	textFromMe: string;
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
};

type ChatFromAIType = {
	textFromAI: string;
};
function convertNewlinesToHTML(text: string) {
	return text.replace(/\n/g, '<br />');
}
export const ChatFromAI = ({ textFromAI }: ChatFromAIType) => {
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

type AIQuestionType = {
	questions: Tquestion[] | undefined;
	onQuestionClick: (
		question: Tquestion,
	) => (event: React.MouseEvent<HTMLButtonElement>) => void;
	isLoading: boolean;
};

export const AIQuestion = ({
	questions,
	onQuestionClick,
	isLoading,
}: AIQuestionType) => {
	return (
		<Stack direction='row' gap='10px' css={sx.chatFromaIWrap}>
			<Image src={profile} alt='profile' width={40} height={40} />
			<Stack css={sx.textFromAI}>
				<Typography variant='body2' color={Color.WhiteText}>
					{/* {textFromAI} */}
					{questions?.length && 'Related questions :'}
				</Typography>
				{questions?.map((question) => (
					<Button
						key={question.question_id}
						css={sx.questionBtn}
						onClick={onQuestionClick(question)}
						disabled={isLoading}
					>
						<Typography variant='h4' color={Color.WhiteText}>
							{question.question_content}
						</Typography>
					</Button>
				))}
			</Stack>
		</Stack>
	);
};
