import { extractToken } from '../utils/extractToken';
import * as jose from 'jose';
// import { PrismaClient } from '@prisma/client/edge';
// import { withAccelerate } from '@prisma/extension-accelerate';
// import { TProvider } from '@/types/types';
export async function getUserInfoEdge(request: Request) {
	const jwt = extractToken(request.headers.get('cookie'));
	const key = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
	const { payload } = await jose.jwtVerify(String(jwt), key, {
		algorithms: ['HS256'],
	});
	console.log('payload: ', payload);
	// const prisma = new PrismaClient().$extends(withAccelerate());
	// return await prisma.userTable.findFirstOrThrow({
	// 	where: {
	// 		user_email: payload.email as string,
	// 		auth_type: payload.provider as TProvider,
	// 	},
	// });
	return payload;
}
// payload:  {
// 	name: '이호준',
// 	email: 'lhj66601234@gmail.com',
// 	picture: 'https://lh3.googleusercontent.com/a/ACg8ocJefgwoJV9gHODug4TeeS97k3iY6pIEhq96ZDbI0RPTonwLv729=s96-c',
// 	sub: '111380965960529828269',
// 	provider: 'google',
// 	authId: '111380965960529828269',
// 	exp: 1717853930,
// 	iat: 1717850330,
// 	jti: 'hojungod'
//   }
