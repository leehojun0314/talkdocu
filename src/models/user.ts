// import { TExtendedSession, TProvider } from '@/types/types';
// import { sqlConnectionPool } from '.';

// export async function selectUser(userEmail: string, provider?: TProvider) {
// 	return (await sqlConnectionPool.connect())
// 		.request()
// 		.input('user_email', userEmail)
// 		.input('provider', provider)
// 		.query(
// 			`SELECT * FROM UserTable WHERE user_email = @user_email AND auth_type = @provider`,
// 		);
// }
// export async function insertUser(
// 	userName: string,
// 	userEmail: string,
// 	profileImg: string,
// 	authType: TProvider,
// 	authId: string,
// ) {
// 	return (await sqlConnectionPool.connect())
// 		.request()
// 		.input('user_name', userName)
// 		.input('user_email', userEmail)
// 		.input('profile_img', profileImg)
// 		.input('auth_type', authType)
// 		.input('auth_id', authId).query(`
// 	INSERT INTO UserTable (user_name, user_email, profile_img, auth_type, auth_id, last_login)
// 	OUTPUT INSERTED.*
// 	VALUES (@user_name, @user_email, @profile_img, @auth_type, @auth_id, GETDATE())
// 	`);
// }
// export async function getUserInfoFromSession(session: TExtendedSession | null) {
// 	const { recordset } = await selectUser(
// 		session?.user?.email ?? '',
// 		session?.provider,
// 	);
// 	console.log('recordset:', recordset);

// 	console.log('session:', session);
// 	if (!recordset.length && session?.user && session?.user?.name) {
// 		console.log('new user');
// 		const insertedUser = await insertUser(
// 			session.user.name as string,
// 			session.user.email as string,
// 			session.user.image as string,
// 			session.provider as TProvider,
// 			session.authId as string,
// 		);
// 		console.log('inserted User:', insertedUser);
// 		return insertedUser.recordset[0];
// 	} else {
// 		return recordset[0];
// 	}
// }
import { TExtendedSession, TProvider } from '@/types/types';
import { prismaAccelerate, prismaEdge } from '.';

export async function selectUser(userEmail: string, provider?: TProvider) {
	return await prismaEdge.userTable.findFirstOrThrow({
		where: {
			user_email: userEmail,
			auth_type: provider,
		},
	});
}

export async function insertUser(
	userName: string,
	userEmail: string,
	profileImg: string,
	authType: TProvider | null,
	authId: string | null,
) {
	return await prismaAccelerate.userTable.create({
		data: {
			user_name: userName,
			user_email: userEmail,
			profile_img: profileImg,
			auth_type: authType,
			auth_id: authId,
			last_login: new Date(),
		},
	});
}

export async function getUserInfoFromSession(session: TExtendedSession | null) {
	if (!session || !session.user || !session.user.email || !session.user.name)
		throw new Error('Invalid parameter given');

	const user = await prismaAccelerate.userTable.findFirstOrThrow({
		where: {
			user_email: session.user.email,
			auth_type: session.provider,
		},
	});
	// if (user && session.user) {
	// 	console.log('new user');

	// 	// const newUser = await insertUser(
	// 	// 	session.user.name,
	// 	// 	session.user.email,
	// 	// 	session.user.image || '',
	// 	// 	session.provider || null,
	// 	// 	session.authId || null,
	// 	// );
	// 	const newUser = await prismaEdge.userTable.create({
	// 		data: {
	// 			user_name: session.user.name,
	// 			user_email: session.user.email,
	// 			profile_img: session.user.image || '',
	// 			auth_type: session.provider,
	// 			auth_id: session.authId,
	// 			last_login: new Date(),
	// 		},
	// 	});
	// 	console.log('inserted User:', newUser);
	// 	return newUser;
	// } else {
	// 	return user;
	// }
	return user;
}
