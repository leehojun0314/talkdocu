import { Color } from '@/common/theme/colors';
import { Mq } from '@/common/theme/screen';
import { css } from '@emotion/react';
import { Dialog, Typography } from '@mui/material';
import Link from 'next/link';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { TrootState } from '@/redux/reducers';
type PcFooterType = {
	position: string;
};

export const PcFooter = ({ position }: PcFooterType) => {
	const [isMyaccOpen, setIsMyaccOpen] = useState<boolean>(false);
	const auth = useSelector((state: TrootState) => state);
	const navModels = [
		// { name: 'My Account', link: '/' },
		{ name: 'Contact', link: 'mailto:info@talkdocu.com' },
		{ name: 'Terms', link: '/terms' },
		{ name: 'Discord', link: 'https://discord.gg/5NYQMrDf5K' },
		// { name: 'Pricing', link: '/' },
	];
	const handleClose = useCallback(() => {
		setIsMyaccOpen(false);
	}, []);
	return (
		<div css={sx.root(position)}>
			<ul css={sx.inner}>
				{navModels.map((it, index) => (
					<li key={index}>
						<Link href={it.link}>
							<Typography color={Color.WhiteText} variant='subtitle1'>
								{it.name}
							</Typography>
						</Link>
					</li>
				))}
				<li>
					<Typography
						color={Color.WhiteText}
						variant='subtitle1'
						style={{
							cursor: 'pointer',
						}}
						onClick={() => {
							setIsMyaccOpen(true);
						}}
					>
						{'My Account'}
					</Typography>
				</li>
			</ul>
			<Typography
				textAlign='center'
				mt='20px'
				color={Color.WhiteText}
				variant='subtitle1'
			>
				Copyright TalkDocu
			</Typography>
			<Dialog open={isMyaccOpen} css={sx.myAccount} onClose={handleClose}>
				<DialogTitle>My Account</DialogTitle>
				<DialogContent>
					<DialogContentText>
						<Typography>Name : {auth.userData?.user_name}</Typography>
						<Typography>Email : {auth.userData?.user_email}</Typography>
					</DialogContentText>
				</DialogContent>
			</Dialog>
		</div>
	);
};

const sx = {
	root: (position: string) => css`
		background: #b05fa5;
		padding: 20px 0;
		width: 100%;
		position: ${position};
		bottom: 0;
		left: 0;
		@media ${Mq.sm} {
			padding: 40px 0;
		}
	`,
	inner: css`
		max-width: 469px;
		margin: 0 auto;
		display: flex;
		justify-content: space-between;
		& li {
			display: flex;
			align-items: center;
		}
		& li:not(:last-child)::after {
			content: '·';
			margin: 0 29px;
			float: right;
			display: block;
			color: #fff;
			@media ${Mq.sm} {
				display: none;
			}
		}
		@media ${Mq.sm} {
			flex-direction: column;
			grid-gap: 10px;
			align-items: center;
		}
	`,
	myAccount: css``,
};
