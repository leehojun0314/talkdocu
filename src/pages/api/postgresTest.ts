// import { sql } from '@vercel/postgres';
// // export const runtime = 'edge';
// export default async function GET(request: Request) {
// 	try {
// 		const result =
// 			await sql`CREATE TABLE Pets ( Name varchar(255), Owner varchar(255) );`;
// 		return new Response(JSON.stringify(result), {
// 			status: 200,
// 		});
// 	} catch (error) {
// 		return new Response(JSON.stringify(error), {
// 			status: 500,
// 		});
// 	}
// }
