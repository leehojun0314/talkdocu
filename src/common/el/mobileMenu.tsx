import { Button, Dialog, DialogTitle, Stack, Typography } from '@mui/material';
import { css } from '@emotion/react';
import { Logo } from './logo';
import Link from 'next/link';
import close from '@/assets/icons/close.svg';
import Image from 'next/image';
import { Color } from '../theme/colors';
import { useSelector } from 'react-redux';
import { TrootState } from '@/redux/reducers';
import AlertDialog from './Dialog/alertDialog';
import useAlert from '../hooks/useAlert';
export const MobileMenu = ({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) => {
	const auth = useSelector((state: TrootState) => state);
	const {
		open: isAlertOpen,
		toggleOpen,
		onClose: onAlertClose,
		content,
	} = useAlert();
	const MenuModels = [
		{ name: '업로드', href: '/' },
		{ name: '채팅', href: '/chat' },
		{ name: 'PDF관리', href: '/manage' },
		// { name: '요금제', href: '/plan' },
	];
	return (
		<Dialog open={open} fullScreen disableScrollLock>
			<div css={sx.root}>
				<Stack direction='row' justifyContent='space-between'>
					<Link href='/upload'>
						<Logo />
					</Link>
					<Button onClick={onClose} css={sx.button}>
						<Image src={close} alt='close' width={24} height={24} />
					</Button>
				</Stack>
				<AlertDialog
					open={isAlertOpen}
					onClose={onAlertClose}
					content={content}
				/>
				<Stack css={sx.nav}>
					{MenuModels.map((it, index) => (
						<Typography
							color={Color.WhiteText}
							key={index}
							onClick={() => {
								if (auth?.isLoggedIn) {
									onClose();
									window.location.href = it.href;
								} else {
									if (it.href === '/chat' || it.href === '/manage') {
										toggleOpen(
											'로그인이 필요한 서비스입니다.',
											true,
											() => {
												onClose();
												toggleOpen('', false, () => {});
											},
										);
									} else {
										onClose();
										window.location.href = it.href;
									}
								}
							}}
							// css={sx.menu}
							variant='h5'
						>
							{it.name}
						</Typography>
					))}
				</Stack>
			</div>
		</Dialog>
	);
};

const sx = {
	root: css`
		background-image: url(/assets/bg/chat_bg.png);
		height: 100%;
		padding: 16px;
	`,
	button: css`
		min-width: fit-content;
		padding: 0;
		&:hover {
			background-color: transparent;
		}
	`,
	nav: css`
		margin-top: 100px;
		gap: 40px;
		align-items: center;
	`,
	menu: css`
		cursor: pointer;
		color: white;
		border-radius: 9px;
		width: 120px;
		height: 50px;
		text-align: center;
		line-height: 50px;
	`,
};
