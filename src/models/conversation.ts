// import { TStatus, TUserFromDB } from '@/types/types';
// import { sqlConnectionPool } from '.';
// import { configs } from '@/config';

// export async function insertConv({
// 	conversationName,
// 	userId,
// 	convStringId,
// }: {
// 	conversationName: string;
// 	userId: number;
// 	convStringId: string;
// }) {
// 	return (await sqlConnectionPool.connect())
// 		.request()
// 		.input('conversation_name', conversationName)
// 		.input('user_id', userId)
// 		.input('conversation_id', convStringId)
// 		.input('salutation', configs.salutationPrefixMessage)
// 		.query(`INSERT INTO Conversation (conversation_name, user_id, created_at, status, conversation_id, salutation, visibility)
//         OUTPUT INSERTED.id VALUES (@conversation_name, @user_id, GETDATE(), 'analyzing', @conversation_id, @salutation, 0)`);
// }
// export async function updateConvStatus(
// 	convIntId: number,
// 	status: TStatus,
// 	userId: number,
// ) {
// 	return (await sqlConnectionPool.connect())
// 		.request()
// 		.input('convIntId', convIntId)
// 		.input('status', status)
// 		.input('user_id', userId).query(`
// UPDATE Conversation SET status = @status WHERE id = @convIntId AND user_id = @user_id`);
// }
// export async function updateConv({
// 	convIntId,
// 	userId,
// 	newName,
// 	newSalutation,
// }: {
// 	convIntId: number;
// 	userId: number;
// 	newName: string;
// 	newSalutation: string;
// }) {
// 	try {
// 		const sqlPool = await sqlConnectionPool.connect();
// 		const transaction = sqlPool.transaction();
// 		await transaction.begin();

// 		// Check if Conversation exists and user_id matches
// 		const conversation = await transaction
// 			.request()
// 			.input('conversation_id', convIntId)
// 			.input('user_id', userId).query(`SELECT *
// 					FROM Conversation
// 					WHERE id = @conversation_id AND user_id = @user_id`);

// 		if (conversation.recordset.length === 0) {
// 			throw new Error('Conversation not found for the given user');
// 		}

// 		// Update Conversation name
// 		await transaction
// 			.request()
// 			.input('conversation_id', convIntId)
// 			.input('conversation_name', newName)
// 			.input('salutation', newSalutation)
// 			.query(
// 				'UPDATE Conversation SET conversation_name=@conversation_name, salutation=@salutation WHERE id=@conversation_id',
// 			);

// 		await transaction.commit();
// 		console.log('Conversation name updated successfully');
// 		return true;
// 	} catch (error) {
// 		console.error('Error updating conversation name:', error);
// 		throw error;
// 	}
// }

// export async function selectConversation(
// 	user: TUserFromDB,
// 	convStringId: string,
// ) {
// 	return (await sqlConnectionPool.connect())
// 		.request()
// 		.query(
// 			`SELECT * FROM Conversation WHERE conversation_id = '${convStringId}' AND (visibility = 1 OR (visibility = 0 AND user_id = ${user.user_id}))`,
// 		);
// }
// export async function selectConversations(user: TUserFromDB) {
// 	return (await sqlConnectionPool.connect())
// 		.request()
// 		.input('user_id', user.user_id)
// 		.query(
// 			`SELECT * FROM Conversation WHERE user_id = '${user.user_id}' AND status <> 'deleted'`,
// 		);
// }
// export async function selectConvByStr(convStringId: string) {
// 	return (await sqlConnectionPool.connect())
// 		.request()
// 		.query(
// 			`SELECT * FROM Conversation WHERE conversation_id = '${convStringId}'`,
// 		);
// }
// export async function selectConvByStrAuth(
// 	convStringId: string,
// 	userId: number,
// ) {
// 	return (await sqlConnectionPool.connect()).request().query(`
// 	SELECT * FROM Conversation WHERE conversation_id = '${convStringId}' AND user_id = ${userId}`);
// }
// export async function deleteConversationModel(
// 	convIntId: number,
// 	userId: number,
// ) {
// 	const transaction = sqlConnectionPool.transaction();
// 	await transaction.begin();

// 	//get user id of the conversation
// 	const { recordset } = await transaction
// 		.request()
// 		.input('conversation_id', convIntId)
// 		.query(`SELECT user_id FROM Conversation WHERE id=@conversation_id;`);

// 	// If the conversation doesn't exist or the user_id doesn't match, throw an error
// 	if (recordset.length === 0 || recordset[0].user_id !== userId) {
// 		throw new Error(
// 			'User does not have permission to delete this conversation',
// 		);
// 	}

// 	// Delete Conversation
// 	await transaction.request().input('conversation_id', convIntId).query(`
// 			DELETE FROM Debate_Message WHERE conversation_id=@conversation_id;
// 			DELETE FROM Debate WHERE conversation_id=@conversation_id;
// 			DELETE FROM Message WHERE conversation_id=@conversation_id;
// 			DELETE FROM Paragraph WHERE conversation_id=@conversation_id;
// 			DELETE FROM Document WHERE conversation_id=@conversation_id;
// 			DELETE FROM Question WHERE conversation_id=@conversation_id;
// 			DELETE FROM Conversation WHERE id=@conversation_id;
// 			`);
// 	const result = await transaction.commit();
// 	console.log('conversation deleted successfully');
// 	return result;
// }
import { configs } from '@/config';
import { PrismaClient, Status } from '@prisma/client';
const prisma = new PrismaClient();

export async function insertConv({
	conversationName,
	userId,
	convStringId,
}: {
	conversationName: string;
	userId: number;
	convStringId: string;
}) {
	return await prisma.conversation.create({
		data: {
			conversation_name: conversationName,
			user_id: userId,
			conversation_id: convStringId,
			salutation: configs.salutationPrefixMessage,
			created_at: new Date(),
			status: 'analyzing',
			visibility: false,
		},
	});
}

export async function updateConvStatus(
	convIntId: number,
	status: Status,
	userId: number,
) {
	return await prisma.conversation.updateMany({
		where: {
			id: convIntId,
			user_id: userId,
		},
		data: {
			status: status,
		},
	});
}

export async function updateConv({
	convIntId,
	userId,
	newName,
	newSalutation,
}: {
	convIntId: number;
	userId: number;
	newName: string;
	newSalutation: string;
}) {
	const conversation = await prisma.conversation.findFirst({
		where: {
			id: convIntId,
			user_id: userId,
		},
	});

	if (!conversation) {
		throw new Error('Conversation not found for the given user');
	}

	return await prisma.conversation.update({
		where: {
			id: convIntId,
		},
		data: {
			conversation_name: newName,
			salutation: newSalutation,
		},
	});
}

export async function selectConversation(userId: number, convStringId: string) {
	return await prisma.conversation.findFirstOrThrow({
		where: {
			conversation_id: convStringId,
			OR: [
				{ visibility: true },
				{
					AND: [{ visibility: false }, { user_id: userId }],
				},
			],
		},
	});
}

export async function selectConversations(userId: number) {
	return await prisma.conversation.findMany({
		where: {
			user_id: userId,
			status: {
				not: 'deleted',
			},
		},
	});
}

export async function selectConvByStr(convStringId: string) {
	return await prisma.conversation.findFirstOrThrow({
		where: {
			conversation_id: convStringId,
		},
	});
}

export async function selectConvByStrAuth(
	convStringId: string,
	userId: number,
) {
	return await prisma.conversation.findFirstOrThrow({
		where: {
			conversation_id: convStringId,
			user_id: userId,
		},
	});
}

export async function deleteConversationModel(
	convIntId: number,
	userId: number,
) {
	const conversation = await prisma.conversation.findUnique({
		where: {
			id: convIntId,
		},
		select: {
			user_id: true,
		},
	});

	if (!conversation || conversation.user_id !== userId) {
		throw new Error(
			'User does not have permission to delete this conversation',
		);
	}

	return await prisma.$transaction([
		prisma.debate_Message.deleteMany({
			where: { conversation_id: convIntId },
		}),
		prisma.debate.deleteMany({ where: { conversation_id: convIntId } }),
		prisma.message.deleteMany({ where: { conversation_id: convIntId } }),
		prisma.paragraph.deleteMany({ where: { conversation_id: convIntId } }),
		prisma.document.deleteMany({ where: { conversation_id: convIntId } }),
		prisma.conversation.delete({ where: { id: convIntId } }),
	]);
}
