import naver from '@/assets/logos/naver.png';
import kakao from '@/assets/logos/kakao.png';
import google from '@/assets/logos/google.png';
import facebook from '@/assets/logos/facebook.png';
import apple from '@/assets/logos/apple.png';
import { Color } from '@/common/theme/colors';

import getConfig from 'next/config';
import generateRandomString from '@/utils/generateRandomString';

const { publicRuntimeConfig } = getConfig();

export const SNSModels = [
	{
		provider: 'apple',
		logo: apple,
		text: 'Sign in with apple',
		bgColor: 'black',
		textColor: Color.WhiteText,
		hoverColor: '#1b1b1b',
		onclick: () => {
			const clientId = publicRuntimeConfig.APPLE_CLIENT_ID;
			const redirectUrl = `${window.location.origin}/callback/apple`;
			const responseType = 'code';
			const state = generateRandomString(16); // 간단한 랜덤 문자열 생성
			const authUrl = `https://appleid.apple.com/auth/authorize?client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectUrl}&state=${state}`;
			window.location.href = authUrl;
		},
	},
	{
		provider: 'google',
		logo: google,
		text: 'Sign in with google',
		bgColor: '#fff',
		textColor: Color.BlackText,
		border: 'solid 1px #eee',
		hoverColor: '#f5f5f5',
		onclick: () => {
			const clientId = publicRuntimeConfig.GOOGLE_CLIENT_ID;
			const redirectUrl = `${window.location.origin}/callback/google`;
			const responseType = 'code';
			const scope = 'openid email profile';
			const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${clientId}&redirect_uri=${redirectUrl}&response_type=${responseType}&scope=${scope}`;
			window.location.href = authUrl;
		},
	},
	{
		provider: 'facebook',
		logo: facebook,
		text: 'Sign in with Facebook',
		bgColor: '#2374F2',
		textColor: Color.WhiteText,
		hoverColor: '#2064d1',
		onclick: () => {
			const clientId = publicRuntimeConfig.FACEBOOK_CLIENT_ID;
			const redirectUrl = `${window.location.origin}/callback/facebook`;
			const state = generateRandomString(8);
			const scope = 'email';
			const authUrl = `https://www.facebook.com/v16.0/dialog/oauth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUrl}&state=${state}&scope=${scope}`;
			window.location.href = authUrl;
		},
	},
	{
		provider: 'naver',
		logo: naver,
		text: 'Sign in with Naver',
		bgColor: '#03C75A',
		textColor: Color.WhiteText,
		hoverColor: ' #059b48',
		onclick: () => {
			const clientId = publicRuntimeConfig.NAVER_CLIENT_ID;
			const state = generateRandomString(16);
			const redirectUrl = `${window.location.origin}/callback/naver`;
			const auth_type = 'reprompt';
			const authUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUrl}&state=${state}&auth_type=${auth_type}`;
			window.location.href = authUrl;
		},
	},
	{
		provider: 'kakao',
		logo: kakao,
		text: 'Sign in with Kakao',
		bgColor: '#FEE500',
		textColor: Color.BlackText,
		hoverColor: '#e6cf00',
		onclick: () => {
			const clientId = publicRuntimeConfig.KAKAO_CLIENT_ID;
			const redirectUrl = `${window.location.origin}/callback/kakao`;
			const authUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUrl}`;
			window.location.href = authUrl;
		},
	},
];
