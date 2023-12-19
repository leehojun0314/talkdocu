import { sqlConnectionPool } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next';

function sayHello() {
	return 'hello world';
}
// export const runtime = 'edge';
// export default async function GET(req: Request) {
// 	console.log('flag 1');
// 	let result;
// 	try {
// 		const sqlpool = await sqlConnectionPool.connect();
// 		console.log('flag 2');
// 		const request = sqlpool.request();
// 		console.log('flag 3');
// 		result = await request.query(
// 			`SELECT * FROM UserTable WHERE user_email = 'dlghwns0314@naver.com'`,
// 		);
// 		console.log('flag 4');
// 		console.log('query result : ', result);
// 		return new Response(`${result}`);
// 	} catch (error) {
// 		console.log(error);
// 		return new Response(`${error}`);
// 	}

// 	// res.status(200).json({ name: 'John Doe' });
// }

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse,
) {
	console.log('flag 1');
	let result;
	try {
		const sqlpool = await sqlConnectionPool.connect();
		console.log('flag 2');
		const request = sqlpool.request();
		console.log('flag 3');
		result = await request.query(
			`SELECT * FROM UserTable WHERE user_email = 'dlghwns0314@naver.com'`,
		);
		console.log('flag 4');
		console.log('query result : ', result);
		res.status(200).send(result);
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
		// return new Response(`${error}`);
	}
}
