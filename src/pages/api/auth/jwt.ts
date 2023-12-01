// import jwt from 'jsonwebtoken';
import { KeyLike, createSecretKey } from 'crypto';
import * as jose from 'jose';
import { NextApiRequest, NextApiResponse } from 'next';
import { nanoid } from 'ai';
export const runtime = 'edge';
export default async function handler(
	req: Request,
	// res: NextApiResponse,
) {
	try {
		const requestBody = await req.json();
		const payload = requestBody.data.authData;
		console.log('payload:', payload);
		if (payload) {
			// const token = jwt.sign(payload, process.env.JWT_SECRET ?? '', {
			// 	expiresIn: '10sec',
			// });
			// jose.jwt
			// const secret : KeyLike =
			// const secret = createSecretKey(process.env.JWT_SECRET ?? '', 'utf-8');
			const token = await new jose.SignJWT(payload)
				.setExpirationTime('10sec')
				.setProtectedHeader({
					alg: 'HS256',
				})
				.setIssuedAt()
				.setJti(nanoid())
				.sign(new TextEncoder().encode(process.env.JWT_SECRET));
			console.log('token: ', token);
			// res.status(200).send(token);
			return new Response(token, { status: 200 });
		} else {
			// res.status(400).send('Invalid payload');
			return new Response('Error occured', { status: 500 });
		}
	} catch (error) {
		console.log('error:', error);
		// res.status(500).send(error);
		return new Response('Error occured', { status: 500 });
	}
}
