import { TExtendedSession, TUserFromDB } from '@/types/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import {
	deleteConversationModel,
	getUserInfoFromSession,
	selectConvByStrAuth,
} from '@/models';
import { deleteParagraphsPinecone } from '@/models/pinecone';

export default async function handler(
	request: NextApiRequest,
	response: NextApiResponse,
) {
	if (request.method !== 'DELETE') {
		response.status(400).send('bad request');
		return;
	}
	const convStringId: string = request.body.convStringId || '';
	try {
		const session: TExtendedSession = await getServerSession(
			request,
			response,
			authOptions,
		);
		const user: TUserFromDB = await getUserInfoFromSession(session);
		const { recordset } = await selectConvByStrAuth(
			convStringId,
			user.user_id,
		);
		const selectedConvIntId: number = recordset[0].id;
		if (!selectedConvIntId) {
			throw new Error('Invalid conversation id or user id');
		}
		// const documents = await selectDocuments(selectedConvIntId)
		//not uploading file to Ncloud
		// for (docu of documents) {
		// 	const fileUrl = docu.document_url;
		// 	//delete from azure storage
		// 	await deleteBlob(fileUrl);
		// }
		const pineconeRes = await deleteParagraphsPinecone(selectedConvIntId);
		console.log('pinecone delete res: ', pineconeRes);
		const deleteRes = await deleteConversationModel(
			selectedConvIntId,
			user.user_id,
		);
		console.log('deleted res: ', deleteRes);
		response.status(200).send('conversation deleted');
	} catch (error) {
		console.log('error: ', error);
		response.status(500).send(error);
	}
}
