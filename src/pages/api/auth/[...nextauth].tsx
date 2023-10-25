import NextAuth from 'next-auth';
import FacebookProvider from 'next-auth/providers/facebook';
import GoogleProvider from 'next-auth/providers/google';
import TwitterProvider from 'next-auth/providers/twitter';
import KakaoProvider from 'next-auth/providers/kakao';
import AppleProvider from 'next-auth/providers/apple';
import NaverProvider from 'next-auth/providers/naver';

export const authOptions = {
	// Configure one or more authentication providers
	providers: [
		FacebookProvider({
			clientId: process.env.FACEBOOK_ID ?? '',
			clientSecret: process.env.FACEBOOK_SECRET ?? '',
		}),

		GoogleProvider({
			clientId: process.env.GOOGLE_ID ?? '',
			clientSecret: process.env.GOOGLE_SECRET ?? '',
		}),
		TwitterProvider({
			clientId: process.env.TWITTER_CLIENT_ID ?? '',
			clientSecret: process.env.TWITTER_SECRET ?? '',
			version: '2.0',
		}),

		KakaoProvider({
			clientId: process.env.KAKAO_CLIENT_ID ?? '',
			clientSecret: process.env.KAKAO_CLIENT_SECRET ?? '',
		}),
		AppleProvider({
			clientId: process.env.APPLE_CLIENT_ID ?? '',
			clientSecret: process.env.APPLE_JWT ?? '',
			authorization: {
				params: {
					scope: 'email name',
				},
			},
		}),
		NaverProvider({
			clientId: process.env.NAVER_ID ?? '',
			clientSecret: process.env.NAVER_SECRET ?? '',
		}),
	],
	pages: {
		signIn: '/login',
	},
	secret: process.env.NEXTAUTH_SECRET ?? '',
};

export default NextAuth(authOptions);
