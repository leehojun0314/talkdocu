import { Button, Dialog, DialogTitle, Stack, Typography } from '@mui/material';
import closeIcon from '@/assets/icons/close.png';
import Image from 'next/image';
import { css } from '@emotion/react';
import pdf from '@/assets/icons/pdf_black.png';
import { Color } from '@/common/theme/colors';
import time from '@/assets/icons/time.png';
import arrow from '@/assets/icons/arrowRight_purple.png';
import { documentModel } from './model';
import { Mq, useCustomMediaQuery } from '@/common/theme/screen';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { TrootState } from '@/redux/reducers';
import axiosAPI from '@/utils/axiosAPI';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { changeConv } from '@/redux/reducers/actions';
import { TConversation } from '@/types/types';
import { useSession } from 'next-auth/react';
import axios from 'axios';
// export type Tconversation = {
// 	conversation_id: number;
// 	conversation_name: string;
// 	end_time: null;
// 	fileUrl: string;
// 	salutation: string;
// 	start_time: null;
// 	user_id: number;
// };
export const ConversationDialog = ({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) => {
	const { isSmall } = useCustomMediaQuery();
	// const auth = useSelector((state: TrootState) => state);
	const { status: authStatus, data: authData } = useSession();
	const [conversations, setConversations] = useState<TConversation[]>();
	const router = useRouter();
	useEffect(() => {
		if (authStatus === 'authenticated') {
			console.log('conversation dialog useEffect');

			axios
				.get('/api/conversation/getMany')
				.then((response) => {
					console.log('conversation res: ', response);
					setConversations(
						response.data.conversations.filter(
							(conv: TConversation) => conv.status === 'created',
						),
					);
				})
				.catch((err) => {
					console.log('conversation dialog error: ', err);
				});
			// axiosAPI({
			// 	method: 'GET',
			// 	url: '/conversation',
			// })
			// 	.then((response) => {
			// 		console.log('conversations res:', response);
			// 		setConversations(
			// 			response.data.filter(
			// 				(conv: TConversation) => conv.status === 'created',
			// 			),
			// 		);
			// 	})
			// 	.catch((err) => {
			// 		console.log('err : ', err);
			// 	});
		}
	}, [authStatus]);
	function handleClickConv(convId: string) {
		return () => {
			onClose();
			// dispatch(changeConv(convId));
			router.push(`/chat?convId=${convId}`);
		};
	}
	return (
		<Dialog open={open} fullWidth css={sx.root}>
			<div css={sx.dialog}>
				<Stack
					css={sx.title}
					direction='row'
					mb='4px'
					justifyContent='space-between'
					alignItems='center'
				>
					<Typography variant='h2'>{'Chat list'}</Typography>
					<Button onClick={onClose}>
						<Image
							src={closeIcon}
							alt='close'
							width={isSmall ? 24 : 48}
							height={isSmall ? 24 : 48}
						/>
					</Button>
				</Stack>
				{conversations?.map((it, index) => (
					<Button
						key={index}
						onClick={handleClickConv(it.conversation_id)}
						css={sx.fileBtn}
					>
						<Stack
							direction='row'
							alignItems='center'
							css={sx.fileBtnInner}
						>
							<Stack gap='11px'>
								<Stack direction='row' alignItems='center' gap='12px'>
									<Image src={pdf} alt='file' width={24} height={24} />
									<Typography color={Color.BlackText} variant='body1'>
										{it.conversation_name}
									</Typography>
								</Stack>
								{/* <Stack direction='row' alignItems='center' gap='12px'>
									<Image
										src={time}
										alt='time'
										width={24}
										height={24}
									/>
									<Typography variant='body2' color={Color.GrayText}>
										{it.time}
									</Typography>
								</Stack> */}
							</Stack>
							<Image src={arrow} alt='arrow' width={36} height={36} />
						</Stack>
					</Button>
				))}
			</div>
		</Dialog>
	);
};

const sx = {
	root: css`
		.MuiPaper-root {
			box-sizing: border-box;
			@media ${Mq.sm} {
				min-width: 90%;
			}
		}
	`,
	dialog: css`
		width: 100%;
		padding: 60px;
		@media ${Mq.md} {
			padding: 16px;
		}
	`,
	title: css`
		border-bottom: solid 1px ${Color.LightGrayText};
		padding-bottom: 20px;
	`,
	fileBtn: css`
		border-bottom: solid 1px ${Color.LightGrayText};
		padding: 20px 16px;
		display: block;
		width: 100%;
	`,
	fileBtnInner: css`
		justify-content: space-between;
	`,
};
