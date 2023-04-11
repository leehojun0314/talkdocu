import naver from '@/assets/logos/naver.png';
import kakao from '@/assets/logos/kakao.png';
import google from '@/assets/logos/google.png';
import facebook from '@/assets/logos/facebook.png';
import apple from '@/assets/logos/apple.png';
import { Color } from '@/common/theme/colors';

import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export const SNSModels = [
	{
		logo: naver,
		text: '네이버로 계속하기',
		bgColor: '#03C75A',
		textColor: Color.WhiteText,
		hoverColor: ' #059b48',
		onclick: () => {
			const clientId = process.env.NAVER_CLIENT_ID;
			const redirectUrl = `${window.location.origin}/loginCallback`;
			const authUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUrl}&state=naver`;
			window.location.href = authUrl;
		},
	},
	{
		logo: kakao,
		text: '카카오로 계속하기',
		bgColor: '#FEE500',
		textColor: Color.BlackText,
		hoverColor: '#e6cf00',
		onclick: () => {
			const clientId = process.env.KAKAO_CLIENT_ID;
			const redirectUrl = `${window.location.origin}/loginCallback`;
			const authUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUrl}`;
			window.location.href = authUrl;
		},
	},
	{
		logo: google,
		text: 'Google로 계속하기',
		bgColor: '#fff',
		textColor: Color.BlackText,
		border: 'solid 1px #eee',
		hoverColor: '#f5f5f5',
		onclick: () => {
			const clientId = publicRuntimeConfig.GOOGLE_CLIENT_ID;
			console.log('client id : ', clientId);
			const redirectUrl = `${window.location.origin}/callback/google`;
			const responseType = 'code';
			const scope = 'openid email profile';
			const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUrl}&response_type=${responseType}&scope=${scope}`;
			window.location.href = authUrl;
		},
	},
	// {
	// 	logo: facebook,
	// 	text: 'Facebook으로 계속하기',
	// 	bgColor: '#2374F2',
	// 	textColor: Color.WhiteText,
	// 	hoverColor: '#2064d1',
	// 	onclick: () => {
	// 		const clientId = process.env.FACEBOOK_CLIENT_ID;
	// 		const redirectUrl = `${window.location.origin}/loginCallback`;
	// 		const authUrl = `https://www.facebook.com/v11.0/dialog/oauth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUrl}`;
	// 		window.location.href = authUrl;
	// 	},
	// },
	{
		logo: apple,
		text: 'Apple로 계속하기',
		bgColor: 'black',
		textColor: Color.WhiteText,
		hoverColor: '#1b1b1b',
		onclick: () => {
			const clientId = process.env.APPLE_CLIENT_ID;
			const redirectUrl = `${window.location.origin}/loginCallback`;
			const state = 'apple';
			const scope = 'email name';
			const authUrl = `https://appleid.apple.com/auth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUrl}&state=${state}&scope=${scope}`;
			window.location.href = authUrl;
		},
	},
];
