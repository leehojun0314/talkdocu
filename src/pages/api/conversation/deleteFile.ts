import {
	getUserInfoFromSession,
	selectConvByStr,
	updateConvStatus,
} from '@/models';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { TDocument, TUserFromDB } from '@/types/types';
import { deleteDocuPinecone } from '@/models/pinecone';
import { deleteDocument } from '@/models/document';

export default async function handler(
	request: NextApiRequest,
	response: NextApiResponse,
) {
	if (request.method !== 'DELETE') {
		response.status(404).send('Bad request');
		return;
	}
	const user: TUserFromDB = await getUserInfoFromSession(
		await getServerSession(request, response, authOptions),
	);
	const userId = user.user_id;
	const convStringId = request.body.convStringId;
	const filesToDelete: TDocument[] = request.body.deleteFiles;
	if (!userId || !convStringId || !filesToDelete) {
		response.status(400).send('Invalid parameter');
		return;
	}
	let convIntId;
	try {
		convIntId = (await selectConvByStr(convStringId)).recordset[0].id;
		if (!convIntId) {
			throw new Error('Invalid conversation id');
		}
		await updateConvStatus(convIntId, 'analyzing', userId);
		let fileIndex = 0;
		for (let fileToDelete of filesToDelete) {
			// response.write(
			// 	JSON.stringify({
			// 		message: `Deleting ${fileToDelete.document_name}`,
			// 		status: 'delete',
			// 		progress: `${Math.floor(
			// 			(fileIndex / filesToDelete.length) * 100,
			// 		)}`,
			// 	}) + '#',
			// );
			// deleteFromPinecone(fileToDelete);
			await deleteFromDB(fileToDelete.document_id, convIntId);
			fileIndex++;
		}
		await updateConvStatus(convIntId, 'created', userId);
		// response.write(
		// 	JSON.stringify({ message: 'All files have been deleted' }),
		// );
		// response.end();
		response.status(200).send('complete');
	} catch (error) {
		console.log('error: ', error);
		updateConvStatus(convIntId, 'created', userId);
		response.status(500).send(error);
	}
}
async function deleteFromDB(docuId: number, convIntId: number) {
	const deleteRes = await deleteDocument(docuId, convIntId);
	console.log('deleteRes');
}
async function deleteFromPinecone(fileToDelete: TDocument) {
	console.log('file to delete: ', fileToDelete);
	const deleteParaRes = await deleteDocuPinecone(fileToDelete.document_id);

	console.log('pinecone delete res: ', deleteParaRes);
}
