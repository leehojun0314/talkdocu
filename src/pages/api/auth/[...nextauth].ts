import NextAuth, { Awaitable } from 'next-auth';
import FacebookProvider from 'next-auth/providers/facebook';
import GoogleProvider from 'next-auth/providers/google';
import TwitterProvider from 'next-auth/providers/twitter';
import KakaoProvider from 'next-auth/providers/kakao';
import AppleProvider from 'next-auth/providers/apple';
import NaverProvider from 'next-auth/providers/naver';
import { NextAuthOptions } from 'next-auth';
import * as jose from 'jose';
import { JWT } from 'next-auth/jwt';
export const authOptions: NextAuthOptions = {
	// Configure one or more authentication providers
	providers: [
		FacebookProvider({
			clientId: process.env.FACEBOOK_CLIENT_ID ?? '',
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
			clientId: process.env.KAKAO_RESTAPI_KEY ?? '',
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
	session: {
		strategy: 'jwt',
		maxAge: 1000 * 60 * 5,
	},
	jwt: {
		async encode({ token, secret, maxAge }) {
			console.log('token: ', token);
			console.log('secret: ', secret);
			console.log('max Age:', maxAge);
			const joseToken = await new jose.SignJWT(token)
				.setExpirationTime('1hour')
				.setProtectedHeader({ alg: 'HS256' })
				.setIssuedAt()
				.setJti(process.env.JWT_SECRET ?? '')
				.sign(new TextEncoder().encode(process.env.NEXTAUTH_SECRET));
			console.log('jose token ;', joseToken);
			const decoded = await jose.jwtVerify(
				joseToken,
				new TextEncoder().encode(process.env.NEXTAUTH_SECRET),
			);
			console.log('decoded: ', decoded);
			return joseToken;
		},
		async decode({ token, secret }) {
			console.log('decode@@@@@@@@@@@@@@@@@@@@@');
			console.log('token: ', token);
			console.log('secret: ', secret);
			const { payload } = await jose.jwtVerify(
				String(token),
				new TextEncoder().encode(String(secret)),
			);
			return { ...payload };
		},
	},
	secret: process.env.NEXTAUTH_SECRET ?? '',
	callbacks: {
		async jwt({ token, account, session }) {
			console.log('account : ', account);
			if (account?.provider) {
				token.provider = account.provider;
			}
			console.log('token : ', token);
			return token;
		},
		async redirect(params) {
			console.log('params: ', params);
			return Promise.resolve(params.baseUrl);
		},
		async session({ session, token, user }) {
			return {
				...session,
				provider: token.provider,
			};
		},
	},
};

export default NextAuth(authOptions);
