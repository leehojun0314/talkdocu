// import { configs } from '@/config';
// import {
// 	TExtendedSession,
// 	TProvider,
// 	TStatus,
// 	TUserFromDB,
// } from '@/types/types';
// import mssql from 'mssql';
// export const sqlConnectionPool = new mssql.ConnectionPool({
// 	user: process.env.DB_USER ?? '',
// 	password: process.env.DB_PWD ?? '',
// 	database: process.env.DB_NAME ?? '',
// 	server: process.env.DB_HOST ?? '',
// 	options: {
// 		encrypt: false,
// 	},
// 	pool: {
// 		max: 10,
// 		min: 0,
// 		idleTimeoutMillis: 30000,
// 	},
// });
import { PrismaClient } from '@prisma/client';
import { PrismaClient as PrismaClientEdge } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';

export const prismaAccelerate = new PrismaClient().$extends(withAccelerate());
export const prismaEdge = new PrismaClientEdge();
