import { NextPage } from 'next';
import { Color } from '@/common/theme/colors';
import { css } from '@emotion/react';
import { Typography } from '@mui/material';
import { Mq, useCustomMediaQuery } from '@/common/theme/screen';
import { PcFooter } from '@/common/el/footer/PcFooter';
import Link from 'next/link';
import Head from 'next/head';
const ErrorPage: NextPage = () => {
	const { isExtraSmall, isSmall } = useCustomMediaQuery();
	const title = {
		main: 'Error',
		desc: 'Something went wrong',
	};
	return (
		<>
			<Head>
				<title>Error</title>
			</Head>
			<div css={sx.mbRoot}>
				<div css={sx.root}>
					<div css={sx.dialog}>
						<Typography
							color={isExtraSmall ? Color.WhiteText : Color.BlackText}
							textAlign='center'
							variant='h1'
						>
							{title.main}
						</Typography>
						<Typography
							css={sx.desc}
							textAlign='center'
							color={isExtraSmall ? Color.LightGrayText : Color.GrayText}
							variant={isExtraSmall ? 'body2' : 'body1'}
						>
							{title.desc}
							<div>
								<Link href={'/'}>Back to home</Link>
							</div>
						</Typography>
					</div>
					{isSmall ? null : <PcFooter position='fixed' />}
				</div>
				{isSmall ? <PcFooter position='relative' /> : null}
			</div>
		</>
	);
};
const sx = {
	mbRoot: css`
		@media ${Mq.sm} {
			display: block;
			height: 100%;
		}
	`,
	root: css`
		background-image: url(/assets/bg/login_bg.png);
		background-size: cover;
		background-position: center;
		width: 100%;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		position: relative;
		padding-bottom: 102px;
		@media ${Mq.sm} {
			height: 100vh;
			padding-bottom: 0;
		}
	`,
	dialog: css`
		background-color: #fff;
		width: 408px;
		height: 200px;
		border-radius: 20px;
		padding: 40px;
		@media ${Mq.xs} {
			background-color: transparent;
		}
	`,
	desc: css`
		margin: 20px 0 60px 0;
	`,
	snsWrap: css`
		gap: 20px;
	`,
	button: (bgColor: string, border?: string, hoverColor?: string) => css`
		background: ${bgColor};
		display: flex;
		align-items: center;
		width: 100%;
		padding: 12px 16px;
		justify-content: flex-start;
		position: relative;
		border: ${border};
		&:hover {
			background-color: ${hoverColor};
		}
	`,
	logo: css`
		position: absolute;
	`,
	btnText: css`
		width: 100%;
		text-align: center;
	`,
};
export default ErrorPage;
