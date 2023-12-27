import { extractToken } from './extractToken';
import * as jose from 'jose';
export async function getUserInfoEdge(request: Request) {
	const jwt = extractToken(request.headers.get('cookie'));
	const key = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);
	const { payload } = await jose.jwtVerify(String(jwt), key, {
		algorithms: ['HS256'],
	});
	return payload;
}
