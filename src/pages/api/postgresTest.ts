// import { prismaEdge } from '@/models';
import { PrismaClient } from '@prisma/client/edge';
// import { sql } from '@vercel/postgres';
const prisma = new PrismaClient();
export const runtime = 'edge';
export default async function GET(request: Request) {
	try {
		// const result =
		// 	await sql`CREATE TABLE Pets ( Name varchar(255), Owner varchar(255) );`;
		const findRes = await prisma.userTable.findFirst({
			where: {
				user_id: 1,
			},
		});
		console.log('create res:', findRes);
		// prismaEdge.$disconnect();
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
