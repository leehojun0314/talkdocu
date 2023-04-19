import { css } from '@emotion/react';

import { Typography } from '@mui/material';
import Link from 'next/link';
import { Color } from '../theme/colors';
import LogoPurple from '@/assets/images/logo_purple.png';
import LogoWhite from '@/assets/images/logo_white.png';
import Image from 'next/image';
export const Logo = () => {
	return (
		<>
			<Link href='/'>
				<div css={sx.logo}>
					{/* <div css={sx.logoImg}></div> */}
					<Image src={LogoWhite} alt='LogoWhite' css={ppl.logoImg} />
					<Typography color={Color.WhiteText} variant='body1'>
						TalkDocu
					</Typography>
				</div>
			</Link>
		</>
	);
};

const sx = {
	logo: css`
		display: flex;
		gap: 10px;
		align-items: center;
	`,
	logoImg: css`
		width: 30px;
		height: 30px;
		background-color: #fff;
		border-radius: 50%;
	`,
};

export const PurpleLogo = () => {
	return (
		<>
			<Link href='/'>
				<div css={sx.logo}>
					{/* <div css={ppl.logoImg}></div> */}
					<Image src={LogoPurple} alt='LogoPurple' css={ppl.logoImg} />
					<Typography color={Color.BrandMain} variant='body1'>
						TalkDocu
					</Typography>
				</div>
			</Link>
		</>
	);
};

const ppl = {
	logoImg: css`
		width: 30px;
		height: 30px;
		/* background-color: ${Color.BrandMain}; */
		border-radius: 50%;
	`,
};
