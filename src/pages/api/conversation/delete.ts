import { TExtendedSession, TUserFromDB } from '@/types/types';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

import { deleteConvPinecone } from '@/models/pinecone';
import { getUserInfoFromSession } from '@/models/user';
import {
	deleteConversationModel,
	selectConvByStrAuth,
} from '@/models/conversation';
import { getUserInfoEdge } from '@/lib/getUserInfoEdge';
import { getErrorMessage } from '@/utils/errorMessage';

export default async function DELETE(req: Request) {
	try {
		const { convStringId } = await req.json();
		const user: TUserFromDB = await getUserInfoEdge(req);
		const conversation = await selectConvByStrAuth(
			convStringId,
			user.user_id,
		);
		const selectedConvIntId: number = conversation.id;
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
		const deleteRes = await deleteConversationModel(
			selectedConvIntId,
			user.user_id,
		);
		console.log('deleted res: ', deleteRes);
		//starter tier is not supported
		// const pineconeRes = await deleteParagraphsPinecone(selectedConvIntId);
		// console.log('pinecone delete res: ', pineconeRes);

		// response.status(200).send('conversation deleted');
		return new Response('conversation deleted', { status: 200 });
	} catch (error) {
		console.log('delete error: ', error);
		return new Response(getErrorMessage(error), { status: 500 });
	}
}
