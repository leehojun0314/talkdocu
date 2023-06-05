import { Color } from '@/common/theme/colors';
import { Mq, useCustomMediaQuery } from '@/common/theme/screen';
import { css } from '@emotion/react';
import {
	Button,
	CircularProgress,
	LinearProgress,
	Stack,
	Typography,
} from '@mui/material';
import { DeleteDialog, DetailDialog, EditDialog } from './el';
import pdf from '@/assets/icons/pdf_black.png';
import Image from 'next/image';
import arrowRight from '@/assets/icons/arrowRight_gray.png';
import { ManageHeaderView } from '@/common/el/Header/manageHeaderView';
import { useManageView } from './el/useManageView';
import { PcFooter } from '@/common/el/footer/PcFooter';
import AlertDialog from '@/common/el/Dialog/alertDialog';
import formatDate from '@/utils/formatDate';
import { Tconversation } from '../chat/hooks/useChatView';
export const ManageView = () => {
	const {
		open,
		handleDetailOpen,
		handleDetailClose,
		editOpen,
		handleEditOpen,
		handleEditClose,
		deleteOpen,
		handleDeleteOpen,
		handleDeleteClose,
		conversations,
		selectedConv,
		handleDelete,
		isLoading,
		isAlertOpen,
		onCloseAlert,
		alertContent,
		handleEditChange,
		scrollRef,
		handleClickChat,
		isLoadingConv,
	} = useManageView();
	const title = {
		main: 'Chat List',
		// desc: 'Click to modify or delete the name of the chat',
		desc: '',
	};
	const { isSmall, isMedium } = useCustomMediaQuery();
	function SetButtons(conversation: Tconversation) {
		switch (conversation.status) {
			case 'created': {
				return (
					<>
						<Button onClick={handleClickChat(conversation)}>Chat</Button>
						<Button onClick={handleDetailOpen(conversation)}>Edit</Button>
					</>
				);
			}
			case 'analyzing': {
				return '';
			}
			case 'error': {
				return (
					<Button onClick={handleDetailOpen(conversation)}>Edit</Button>
				);
			}
			default: {
				return '';
			}
		}
	}
	return (
		<div css={sx.root}>
			<ManageHeaderView />
			<DetailDialog
				open={open}
				onClose={handleDetailClose}
				handleEditOpen={handleEditOpen}
				handleDeleteOpen={handleDeleteOpen}
				conversation={selectedConv}
			/>
			<AlertDialog
				open={isAlertOpen}
				onClose={onCloseAlert}
				content={alertContent}
			/>
			<EditDialog
				open={editOpen}
				onClose={handleEditClose}
				conversation={selectedConv}
				handleEditChange={handleEditChange}
			/>
			<DeleteDialog
				open={deleteOpen}
				onClose={handleDeleteClose}
				selectedConv={selectedConv}
				handleDelete={handleDelete}
				isLoading={isLoading}
			/>
			<Stack p={isSmall ? '0' : '60px'} css={sx.dialog}>
				<Stack p={isSmall ? '40px' : '0'}>
					<Typography variant='h2' color={Color.BlackText}>
						{title.main}
					</Typography>
					<Typography
						variant='body2'
						mt='10px'
						mb={isSmall ? ' 0' : '40px'}
						color={Color.GrayText}
					>
						{title.desc}
					</Typography>
				</Stack>
				{isMedium ? null : (
					<div css={sx.menu}>
						<span css={sx.menuTitle}>Chat name</span>
						<span css={sx.menuTitle}>Created at</span>
						<span css={sx.menuTitle}>ID</span>
						<span css={sx.menuTitle}>status</span>
					</div>
				)}
				{isLoadingConv ? (
					<div css={sx.loadingConv}>
						<CircularProgress
							style={{
								color: Color.WhiteText,
							}}
						/>
					</div>
				) : (
					<Stack css={sx.content}>
						<div ref={scrollRef}>
							{conversations.length ? (
								conversations.map((conversation, index) => {
									return isMedium ? (
										<Button
											css={sx.mbBtn}
											onClick={
												conversation.status === 'created'
													? handleClickChat(conversation)
													: undefined
											}
											key={index}
										>
											<Stack
												direction='row'
												alignItems='center'
												css={sx.btnInner}
											>
												<Stack
													direction='row'
													alignItems='center'
													gap='12px'
												>
													<Image
														src={pdf}
														alt='pdf'
														width={24}
														height={24}
													/>
													<Typography>
														{conversation.conversation_name}
													</Typography>
													<Typography color={Color.GrayText}>
														{conversation.status}
													</Typography>
												</Stack>

												<Image
													src={arrowRight}
													alt='arrow'
													width={24}
													height={24}
												/>
											</Stack>
										</Button>
									) : (
										<Stack
											css={sx.button}
											key={index}
											sx={{ borderRadius: 0 }}
										>
											<Typography
												color={Color.BlackText}
												variant='body2'
											>
												{conversation.conversation_name}
											</Typography>
											<Typography
												color={Color.BlackText}
												variant='body2'
											>
												{formatDate(conversation.created_at)}
												{/* {conversation.created_at} */}
											</Typography>
											<Typography
												color={Color.BlackText}
												variant='body2'
											>
												{conversation.conversation_id}
											</Typography>
											<Typography
												color={Color.BlackText}
												variant='body2'
											>
												{conversation.status}
												{conversation.status === 'analyzing' && (
													<CircularProgress
														size={20}
														style={{
															marginLeft: '5px',
															color: Color.WhiteText,
														}}
													/>
												)}
											</Typography>
											{/* {conversation.status === 'created' ? (
											<>
												<Button
													onClick={handleClickChat(conversation)}
												>
													Chat
												</Button>
												<Button
													onClick={handleDetailOpen(conversation)}
												>
													Edit
												</Button>
											</>
										) : (
											''
										)} */}
											{SetButtons(conversation)}
										</Stack>
									);
								})
							) : (
								<div
									style={{
										display: 'flex',
										justifyContent: 'center',
										alignItems: 'center',
										height: '100%',
									}}
								>
									<Typography
										style={{
											textAlign: 'center',
											color: Color.GrayText,
										}}
									>
										There is no chat room available. <br /> Please
										upload a file on the homepage and create a chat.
									</Typography>
								</div>
							)}
						</div>
					</Stack>
				)}

				{/* <Stack direction='row' p='20px' justifyContent='space-between'>
					<Typography
						variant={isSmall ? 'subtitle1' : 'body1'}
						color={Color.BlackText}
					>
						{'Storage usage'}
					</Typography>
					<Stack direction='row'>
						<Typography
							color={Color.BrandMain}
							variant={isSmall ? 'subtitle1' : 'body1'}
						>
							300MB{' '}
						</Typography>
						<Typography
							variant={isSmall ? 'subtitle1' : 'body1'}
							color={Color.BlackText}
						>
						</Typography>
						<Typography
							variant={isSmall ? 'subtitle1' : 'body1'}
							color={Color.GrayText}
						>
							{' /  1,000MB'}
						</Typography>
					</Stack>
				</Stack> */}
				{/* <LinearProgress
					variant='determinate'
					value={35}
					color='secondary'
					sx={{
						backgroundColor: Color.chatBackground,
						'& .MuiLinearProgress-bar': {
							borderRadius: 10,
							overflow: 'hidden',
						},
						'& .MuiLinearProgress-bar1Buffer': {
							borderRadius: 10,
							overflow: 'hidden',
						},
					}}
				/> */}
			</Stack>
			<PcFooter position={isSmall ? 'relative' : 'fixed'} />
		</div>
	);
};

const sx = {
	root: css`
		background-image: url(/assets/bg/chat_bg.png);
		background-size: cover;
		background-position: center;
		width: 100%;
		height: 100vh;
		padding-top: 62px;
		padding-bottom: 100px;
		@media ${Mq.sm} {
			background-image: none;
			padding-bottom: 0;
		}
	`,
	dialog: css`
		max-width: 1000px;
		background-color: #fff;
		border-radius: 20px;
		margin: 67px auto;

		@media ${Mq.sm} {
			margin: 0 auto;
			height: calc(100vh - 62px);
		}
	`,
	menu: css`
		width: 100%;
		padding: 10px 10px;
		padding-right: 40px;
		display: grid;
		grid-template-columns: 1fr 1fr 2.5fr 1fr 1fr;
		font-family: 'Pretendard-Regular';
	`,
	menuTitle: css`
		color: ${Color.GrayText};
		font-size: 12px;
	`,
	content: css`
		overflow-y: scroll;
		height: calc(100vh - 530px);
		::-webkit-scrollbar {
			position: absolute;
			background-color: transparent;
			width: 20px;
		}
		::-webkit-scrollbar-thumb {
			border: 7px solid rgba(0, 0, 0, 0);
			background-clip: padding-box;
			border-radius: 999px;
			background-color: rgba(175, 165, 165, 0.219);
		}
		@media ${Mq.sm} {
			/* height: calc(100vh - 350px); */
			height: 100%;
		}
	`,
	btnInner: css`
		justify-content: space-between;
		width: 100%;
	`,
	mbBtn: css`
		width: 100%;
		border-top: solid 1px ${Color.LightGrayText};
		padding: 20px;
		border-radius: 0;
	`,
	button: css`
		display: grid !important;
		grid-template-columns: 1fr 1fr 2.5fr 1fr 0.5fr 0.5fr;
		justify-content: flex-start;
		width: 100%;
		padding: 10px 10px;
		border-top: solid 1px ${Color.LightGrayText};
		p {
			display: flex;
			margin: auto 0;
		}
	`,
	loadingConv: css`
		margin: 0 auto;
		padding-top: 50px;
		height: 100px;
	`,
};
