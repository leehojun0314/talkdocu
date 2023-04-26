import { Logo, PurpleLogo } from '../logo';
import menu from '@/assets/icons/menu.png';
import Image from 'next/image';
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import menu_black from '@/assets/icons/menu_black.png';
import { Button, Popover, Typography } from '@mui/material';
import { MobileMenu } from '../mobileMenu';
import Link from 'next/link';
import { Color } from '@/common/theme/colors';
import { useSelector } from 'react-redux';
import { TrootState } from '@/redux/reducers';
import arrowDown from '@/assets/icons/arrow_down.png';
import arrowDown_black from '@/assets/icons/arrowDown_black.png';
import { useDispatch } from 'react-redux';
import { logout } from '@/redux/reducers/actions';
export const MobileHeader = () => {
	const auth = useSelector((state: TrootState) => state);
	const dispatch = useDispatch();
	const [menuOpen, setMenuOpen] = useState(false);
	const [popoverEl, setPopoverEl] = useState<HTMLElement | null>(null);
	const profilePopover = Boolean(popoverEl);
	function handleProfilePopOpen(event: React.MouseEvent<HTMLElement>) {
		setPopoverEl(event.currentTarget);
	}
	function handleProfilePopClose(event: React.MouseEvent<HTMLElement>) {
		setPopoverEl(null);
	}
	function handleLogout() {
		setPopoverEl(null);
		localStorage.setItem('token', '');
		dispatch(logout());
		const pathname = window.location.pathname;
		if (pathname.includes('chat') || pathname.includes('manage')) {
			window.location.href = '/';
		}
	}
	const handleClickOpen = () => {
		setMenuOpen(true);
	};
	const handleClose = () => {
		setMenuOpen(false);
	};

	const [scrollPosition, setScrollPosition] = useState(0);
	const updateScroll = () => {
		setScrollPosition(window.scrollY || document.documentElement.scrollTop);
	};

	useEffect(() => {
		window.addEventListener('scroll', updateScroll);
	});

	return (
		<div css={sx.root} className={scrollPosition < 62 ? '' : 'headerBg'}>
			<MobileMenu open={menuOpen} onClose={handleClose} />
			<Link href='/'>{scrollPosition < 62 ? <Logo /> : <PurpleLogo />}</Link>
			<div>
				{auth.isLoggedIn ? (
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
					<Button
						css={sx.loginBtn}
						onClick={() => {
							window.location.href = '/login';
						}}
					>
						Sign in
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
						Sign out
					</Button>
				</Popover>
				<Button css={sx.button} onClick={handleClickOpen}>
					{scrollPosition < 62 ? (
						<Image src={menu} alt='menu' width={24} height={24} />
					) : (
						<Image src={menu_black} alt='menu' width={24} height={24} />
					)}
				</Button>
			</div>
		</div>
	);
};

const sx = {
	root: css`
		display: flex;
		justify-content: space-between;
		position: fixed;
		top: 0;
		left: 0;
		padding: 16px;
		width: 100%;
		align-items: center;
		z-index: 55;
		&.headerBg {
			background-color: #fff;
			box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.05);
		}
	`,
	button: css`
		margin: 0;
		padding: 0;
		min-width: 28px;
		&:hover {
			background-color: transparent;
		}
	`,
	loginBtn: css`
		background-color: #fff;
		color: ${Color.BrandMain};
		margin-right: 10px;
	`,
	nameBtn: css`
		float: left;
		display: flex;
		align-items: center;
		gap: 11px;
		height: 40px;
		width: 100px;
		padding-left: 7px;
		padding-right: 7px;
		margin-right: 5px;
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
