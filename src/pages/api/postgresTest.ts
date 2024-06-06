import { PrismaClient } from '@prisma/client/edge';
// import { sql } from '@vercel/postgres';
export const runtime = 'edge';
export default async function GET(request: Request) {
	try {
		const prisma = new PrismaClient();
		// const result =
		// 	await sql`CREATE TABLE Pets ( Name varchar(255), Owner varchar(255) );`;
		const createRes = await prisma.userTable.create({
			data: {
				user_name: 'test',
				user_email: 'testmail@example.com',
				profile_img: 'testimageurl',
				auth_type: 'google',
				auth_id: 'somelongid',
				last_login: new Date(),
			},
		});
		console.log('create res:', createRes);
		prisma.$disconnect();
		return new Response(JSON.stringify('hi'), {
			status: 200,
		});
	} catch (error) {
		console.log('error: ', error);
		return new Response(JSON.stringify(error), {
			status: 500,
		});
	}
}
