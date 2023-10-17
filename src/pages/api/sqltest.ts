import sql from 'mssql';
import type { NextApiRequest, NextApiResponse } from 'next';

const sqlConnectionPool = new sql.ConnectionPool({
	user: process.env.DB_USER ?? '',
	password: process.env.DB_PWD ?? '',
	database: process.env.DB_NAME ?? '',
	server: process.env.DB_HOST ?? '',
	options: {
		encrypt: true,
	},
	pool: {
		max: 10,
		min: 0,
		idleTimeoutMillis: 30000,
	},
});
type Data = {
	name: string;
};
function sayHello() {
	return 'hello world';
}
// export const runtime = 'edge';
export default async function GET(
	req: NextApiRequest,
	res: NextApiResponse<Data>,
) {
	console.log('flag 1');
	try {
		const sqlpool = await sqlConnectionPool.connect();
		console.log('flag 2');
		const request = sqlpool.request();
		console.log('flag 3');
		const result = await request.query(
			`SELECT * FROM UserTable WHERE user_email = 'dlghwns0314@naver.com'`,
		);
		console.log('flag 4');
		console.log('query result : ', result);
	} catch (error) {
		console.log(error);
	}

	res.send({ name: 'hello' });
	// res.status(200).json({ name: 'John Doe' });
}
