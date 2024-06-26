import NextAuth, { Awaitable } from 'next-auth';
import FacebookProvider from 'next-auth/providers/facebook';
import GoogleProvider from 'next-auth/providers/google';
import TwitterProvider from 'next-auth/providers/twitter';
import KakaoProvider from 'next-auth/providers/kakao';
import NaverProvider from 'next-auth/providers/naver';
import { NextAuthOptions } from 'next-auth';
import * as jose from 'jose';
import { insertUser, selectUser } from '@/models';
import { TProvider } from '@/types/types';
export const authOptions: NextAuthOptions = {
	// Configure one or more authentication providers
	providers: [
		// FacebookProvider({
		// 	clientId: process.env.FACEBOOK_CLIENT_ID ?? '',
		// 	clientSecret: process.env.FACEBOOK_SECRET ?? '',
		// 	authorization: {
		// 		params: {
		// 			prompt: 'select_account',
		// 		},
		// 	},
		// }),

		GoogleProvider({
			clientId: process.env.GOOGLE_ID ?? '',
			clientSecret: process.env.GOOGLE_SECRET ?? '',
			authorization: {
				params: {
					prompt: 'select_account',
				},
			},
		}),
		// TwitterProvider({
		// 	clientId: process.env.TWITTER_CLIENT_ID ?? '',
		// 	clientSecret: process.env.TWITTER_SECRET ?? '',
		// 	version: '2.0',
		// }),

		KakaoProvider({
			clientId: process.env.KAKAO_RESTAPI_KEY ?? '',
			clientSecret: process.env.KAKAO_CLIENT_SECRET ?? '',
			authorization: {
				params: {
					prompt: 'select_account',
				},
			},
		}),
		// AppleProvider({
		// 	clientId: process.env.APPLE_CLIENT_ID ?? '',
		// 	clientSecret: process.env.APPLE_JWT ?? '',
		// 	authorization: {
		// 		params: {
		// 			scope: 'email name',
		// 		},
		// 	},
		// }),
		NaverProvider({
			clientId: process.env.NAVER_ID ?? '',
			clientSecret: process.env.NAVER_SECRET ?? '',
			authorization: {
				params: {
					// prompt: 'select_account',
					auth_type: 'reauthenticate',
				},
			},
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
			const joseToken = await new jose.SignJWT(token)
				.setExpirationTime('1hour')
				.setProtectedHeader({ alg: 'HS256' })
				.setIssuedAt()
				.setJti(process.env.JWT_SECRET ?? '')
				.sign(new TextEncoder().encode(process.env.NEXTAUTH_SECRET));
			return joseToken;
		},
		async decode({ token, secret }) {
			const { payload } = await jose.jwtVerify(
				String(token),
				new TextEncoder().encode(String(secret)),
			);
			return { ...payload };
		},
	},
	secret: process.env.NEXTAUTH_SECRET ?? '',
	callbacks: {
		// async signIn(params) {
		// 	if (typeof window !== 'undefined') {
		// 		const redirectUrl = sessionStorage.getItem('redirectUrl');
		// 		if (redirectUrl) {
		// 			return redirectUrl;
		// 		}
		// 	}
		// 	return '/';
		// },
		async signIn(params) {
			const { recordset } = await selectUser(
				params.user.email as string,
				params?.account?.provider as TProvider,
			);
			if (
				!recordset.length &&
				params.user &&
				params.user.name &&
				params.account
			) {
				const insertUserRes = await insertUser(
					params.user.name as string,
					params.user.email as string,
					params.user.image as string,
					params.account.provider as TProvider,
					params.account.providerAccountId as string,
				);
				console.log('insert User res: ', insertUserRes);
			}
			return true;
		},
		async jwt({ token, account, session }) {
			if (account?.provider) {
				token.provider = account.provider;
				token.authId = account.providerAccountId;
			}

			return token;
		},
		// async redirect(params) {
		// 	const redirect = params.url.search('redirect');
		// 	console.log('redirect params: ', params);
		// 	console.log('redirect: ', redirect);
		// 	return Promise.resolve(params.baseUrl);
		// },
		async session({ session, token, user }) {
			return {
				...session,
				provider: token.provider,
				authId: token.authId,
			};
		},
	},
};

export default NextAuth(authOptions);
