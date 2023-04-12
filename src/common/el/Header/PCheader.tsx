import { css } from '@emotion/react';
import { Button, Typography } from '@mui/material';
import { Color } from '../../theme/colors';
import arrowDown from '@/assets/icons/arrow_down.png';
import Image from 'next/image';
import { Logo, PurpleLogo } from '../logo';
import { Mq } from '../../theme/screen';
import { useEffect, useState } from 'react';
import arrowDown_black from '@/assets/icons/arrowDown_black.png';
import Link from 'next/link';
import axiosAPI from '@/utils/axiosAPI';
type authType = {
	isLoggedIn: boolean;
	userData?: {
		user_email: string;
		user_id: number;
		user_name: string;
	} | null;
};
export const Pcheader = () => {
	const [scrollPosition, setScrollPosition] = useState(0);
	const [auth, setAuth] = useState<authType>({
		isLoggedIn: false,
		userData: null,
	});
	const updateScroll = () => {
		setScrollPosition(window.scrollY || document.documentElement.scrollTop);
	};
	useEffect(() => {
		window.addEventListener('scroll', updateScroll);
		// axiosAPI({
		// 	method: 'GET',
		// 	url: '/auth/check',
		// })
		// 	.then((response) => {
		// 		console.log('data : ', response.data);
		// 		setAuth({
		// 			isLoggedIn: response.data.isLoggedIn,
		// 			userData: response.data.userData,
		// 		});
		// 	})
		// 	.catch((err) => {
		// 		if (err.response.status === 401) {
		// 			setAuth(err.response.data.isLoggedIn);
		// 		}
		// 	});
		axiosAPI({
			method: 'GET',
			url: '/auth/',
		})
			.then((response) => {
				console.log('response: ', response);
			})
			.catch((err) => {
				console.log('err: ', err);
			});
	}, []);

	const navModels = [
		{ link: '/upload', title: '업로드' },
		{ link: '/chat', title: '채팅' },
		{ link: '/manage', title: 'PDF관리' },
		{ link: '/plan', title: '요금제' },
	];

	return (
		<div css={sx.root} className={scrollPosition < 12 ? '' : 'headerBg'}>
			<div css={sx.inner}>
				{scrollPosition < 12 ? <Logo /> : <PurpleLogo />}
				<ul css={sx.nav}>
					{navModels.map((it, index) => (
						<li key={index}>
							<Link href={it.link}>
								<Typography
									variant='body2'
									color={
										scrollPosition < 12
											? Color.WhiteText
											: Color.BlackText
									}
								>
									{it.title}
								</Typography>
							</Link>
						</li>
					))}
				</ul>
				{auth.isLoggedIn ? (
					<div css={sx.nameBtn}>
						<Typography
							variant='body2'
							color={
								scrollPosition < 12 ? Color.WhiteText : Color.BlackText
							}
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
					<Button variant='contained' color='secondary'>
						<Link href={'/login'}>
							<Typography color={Color.BlackText}>Login</Typography>
						</Link>
					</Button>
				)}
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
	nameBtn: css`
		display: flex;
		align-items: center;
		gap: 11px;
	`,
};
