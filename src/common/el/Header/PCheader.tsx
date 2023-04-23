import { css } from '@emotion/react';
import { Button, Popover, Typography } from '@mui/material';
import { Color } from '../../theme/colors';
import arrowDown from '@/assets/icons/arrow_down.png';
import Image from 'next/image';
import { Logo, PurpleLogo } from '../logo';
import { Mq } from '../../theme/screen';
import { useEffect, useRef, useState } from 'react';
import arrowDown_black from '@/assets/icons/arrowDown_black.png';
import Link from 'next/link';
import axiosAPI from '@/utils/axiosAPI';
import { useSelector } from 'react-redux';
import { TrootState } from '@/redux/reducers';
import usePCheader from './hooks/usePCheader';
import useAlert from '@/common/hooks/useAlert';
import AlertDialog from '../Dialog/alertDialog';
import { useRouter } from 'next/router';

export const Pcheader = () => {
	const {
		scrollPosition,
		auth,
		profilePopover,
		popoverEl,
		navModels,
		handleProfilePopClose,
		handleProfilePopOpen,
		handleLogout,
	} = usePCheader();
	const { open, toggleOpen, content, onClose } = useAlert();
	const router = useRouter();
	return (
		<div css={sx.root} className={scrollPosition < 12 ? '' : 'headerBg'}>
			<AlertDialog open={open} onClose={onClose} content={content} />
			<div css={sx.inner}>
				{scrollPosition < 12 ? <Logo /> : <PurpleLogo />}
				<ul css={sx.nav}>
					{navModels.map((it, index) => (
						<li key={index}>
							<Typography
								variant='body2'
								color={
									scrollPosition < 12
										? Color.WhiteText
										: Color.BlackText
								}
								onClick={() => {
									if (auth?.isLoggedIn) {
										window.location.href = it.link;
									} else {
										if (
											it.link === '/chat' ||
											it.link === '/manage'
										) {
											toggleOpen(
												'로그인이 필요한 서비스입니다.',
												true,
												() => {
													toggleOpen('', false, () => {});
													console.log('login clicked');
													// window.location.href = '/login/';
													router.push('/login');
												},
											);
										}
									}
								}}
							>
								{it.title}
							</Typography>
						</li>
					))}
				</ul>

				{auth?.isLoggedIn ? (
					<div
						css={sx.nameBtn}
						aria-owns='profile-popover'
						onClick={handleProfilePopOpen}
						className={scrollPosition < 12 ? '' : 'scrolled'}
					>
						<Typography
							variant='body2'
							color={
								scrollPosition < 12 ? Color.WhiteText : Color.BlackText
							}
							style={{
								whiteSpace:
									'nowrap' /* 텍스트가 한 줄로 표시되도록 설정 */,
								overflow: 'hidden' /* 넘치는 텍스트를 숨김 */,
								textOverflow: 'ellipsis' /* 말줄임표(...)를 표시 */,
							}}
						>
							{auth?.userData?.user_name}
						</Typography>
						<Image
							src={scrollPosition < 12 ? arrowDown : arrowDown_black}
							alt='down'
							width={9}
							height={5}
						/>
					</div>
				) : (
					<Button css={sx.loginBtn}>
						<Link href={'/login'}>
							<Typography
								color={
									scrollPosition < 12
										? Color.WhiteText
										: Color.BlackText
								}
							>
								로그인
							</Typography>
						</Link>
					</Button>
				)}
				<Popover
					open={profilePopover}
					disableScrollLock={true}
					id='profile-popover'
					anchorEl={popoverEl}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'center',
					}}
					transformOrigin={{
						vertical: 'top',
						horizontal: 'center',
					}}
					onClose={handleProfilePopClose}
				>
					<Button css={sx.popover} onClick={handleLogout}>
						로그아웃
					</Button>
				</Popover>
			</div>
		</div>
	);
};

const sx = {
	root: css`
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		z-index: 55;
		&.headerBg {
			background-color: #fff;
			color: ${Color.BlackText};
			box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.05);
		}
	`,
	inner: css`
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		padding: 20px 0;
		max-width: 1000px;
		margin: 0 auto;
		@media ${Mq.xl} {
			padding: 20px 60px;
		}
	`,
	nav: css`
		display: flex;
		gap: 2.083vw;
		& li {
			cursor: pointer;
		}
	`,
	loginBtn: css`
		color: ${Color.BrandMain};
		:hover {
			background-color: ${Color.hoverDark};
		}
		&.scrolled {
			color: ${Color.BlackText};
			background-color: #fff;
			:hover {
				background-color: ${Color.lightPurple};
			}
		}
	`,
	nameBtn: css`
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 11px;
		height: 40px;
		width: 80px;
		padding-left: 7px;
		padding-right: 7px;
		/* background-color: ${Color.BrandMain}; */
		color: ${Color.BrandMain};
		border-radius: 8px;
		cursor: pointer;
		:hover {
			background-color: ${Color.hoverDark};
		}
		&.scrolled {
			color: ${Color.BlackText};
			background-color: #fff;
			:hover {
				background-color: ${Color.lightPurple};
			}
		}
	`,
	popover: css`
		color: black;
		:hover {
			background-color: ${Color.lightPurple};
		}
	`,
};
