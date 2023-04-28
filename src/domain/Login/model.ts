import naver from '@/assets/logos/naver.png';
import kakao from '@/assets/logos/kakao.png';
import google from '@/assets/logos/google.png';
import facebook from '@/assets/logos/facebook.png';
import apple from '@/assets/logos/apple.png';
import { Color } from '@/common/theme/colors';

import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export const SNSModels = [
	// {
	// 	logo: naver,
	// 	text: 'Sign in with Naver',
	// 	bgColor: '#03C75A',
	// 	textColor: Color.WhiteText,
	// 	hoverColor: ' #059b48',
	// 	onclick: () => {
	// 		const clientId = process.env.NAVER_CLIENT_ID;
	// 		const redirectUrl = `${window.location.origin}/loginCallback`;
	// 		const authUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUrl}&state=naver`;
	// 		window.location.href = authUrl;
	// 	},
	// },
	// {
	// 	logo: kakao,
	// 	text: 'Sign in with Kakao',
	// 	bgColor: '#FEE500',
	// 	textColor: Color.BlackText,
	// 	hoverColor: '#e6cf00',
	// 	onclick: () => {
	// 		const clientId = process.env.KAKAO_CLIENT_ID;
	// 		const redirectUrl = `${window.location.origin}/loginCallback`;
	// 		const authUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUrl}`;
	// 		window.location.href = authUrl;
	// 	},
	// },
	{
		logo: google,
		text: 'Sign in with google',
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
	// {
	// 	logo: apple,
	// 	text: 'Sign in with apple',
	// 	bgColor: 'black',
	// 	textColor: Color.WhiteText,
	// 	hoverColor: '#1b1b1b',
	// 	onclick: () => {
	// 		const clientId = publicRuntimeConfig.APPLE_CLIENT_ID;
	// 		console.log('client id : ', clientId);
	// 		const redirectUrl = `${window.location.origin}/callback/apple`;
	// 		const responseType = 'code';
	// 		const scope = 'name email';
	// 		const state = 'random_string'; // 간단한 랜덤 문자열 생성
	// 		const authUrl = `https://appleid.apple.com/auth/authorize?client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectUrl}&scope=${scope}&state=${state}`;
	// 		window.location.href = authUrl;
	// 	},
	// },
];
