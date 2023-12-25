import { extractToken } from './extractToken';
import * as jose from 'jose';
export async function getUserInfoEdge(request: Request) {
	const jwt = extractToken(request.headers.get('cookie'));
	console.log('jwt: ', jwt);
	const key = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
	console.log('key: ', key);
	const { payload } = await jose.jwtVerify(String(jwt), key, {
		algorithms: ['HS256'],
	});
	console.log('payload:', payload);
	return payload;
}
