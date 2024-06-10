// import { NextApiRequest, NextApiResponse } from 'next';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '../auth/[...nextauth]';
import { TUserFromDB } from '@/types/types';
// import { deleteDocuPinecone } from '@/models/pinecone';
import { deleteDocument } from '@/models/document';
// import { getUserInfoFromSession } from '@/models/user';
import { selectConvByStr, updateConvStatus } from '@/models/conversation';
import { getUserInfoEdge } from '@/lib/getUserInfoEdge';
import { getErrorMessage } from '@/utils/errorMessage';
export const runtime = 'edge';
export default async function DELETE(request: Request) {
	// if (request.method !== 'DELETE') {
	// 	response.status(404).send('Bad request');
	// 	return;
	// }
	const user: TUserFromDB = await getUserInfoEdge(request);
	const userId = user.user_id;
	// const convStringId = request.body.convStringId;
	// // const filesToDelete: TDocument[] = request.body.deleteFiles;
	const { convStringId, deleteFiles } = await request.json();
	if (!userId || !convStringId || !deleteFiles) {
		// response.status(400).send('Invalid parameter');
		return new Response('Invalid parameter', { status: 400 });
	}
	let convIntId;
	try {
		convIntId = (await selectConvByStr(convStringId)).id;
		if (!convIntId) {
			throw new Error('Invalid conversation id');
		}
		await updateConvStatus(convIntId, 'analyzing', userId);
		// let fileIndex = 0;
		for (let fileToDelete of deleteFiles) {
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
			// fileIndex++;
		}
		await updateConvStatus(convIntId, 'created', userId);
		// response.write(
		// 	JSON.stringify({ message: 'All files have been deleted' }),
		// );
		// response.end();
		// response.status(200).send('complete');
		return new Response('Complete', { status: 200 });
	} catch (error) {
		console.log('error: ', error);
		if (convIntId) {
			updateConvStatus(convIntId, 'error', userId);
		}
		// response.status(500).send(error);
		return new Response(getErrorMessage(error), {
			status: 500,
		});
	}
}
async function deleteFromDB(docuId: number, convIntId: number) {
	const deleteRes = await deleteDocument(docuId, convIntId);
	console.log('deleteRes: ', deleteRes);
}
// async function deleteFromPinecone(fileToDelete: TDocument) {
// 	console.log('file to delete: ', fileToDelete);
// 	const deleteParaRes = await deleteDocuPinecone(fileToDelete.document_id);

// 	console.log('pinecone delete res: ', deleteParaRes);
// }
