import {
	getUserInfoFromSession,
	selectConvByStr,
	updateConvStatus,
} from '@/models';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { TDocument, TUserFromDB } from '@/types/types';
import { deleteParagraphPinecone_single } from '@/models/pinecone';

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
		for await (let fileToDelete of filesToDelete) {
			response.write(
				JSON.stringify({
					message: `Deleting ${fileToDelete.document_name}`,
					status: 'delete',
					progress: `${Math.floor(
						(fileIndex / filesToDelete.length) * 100,
					)}`,
				}) + '#',
			);
			await processFile(fileToDelete);
			fileIndex++;
		}
		await updateConvStatus(convIntId, 'created', userId);
		response.write(
			JSON.stringify({ message: 'All files have been deleted' }),
		);
		response.end();
	} catch (error) {
		console.log('error: ', error);
		updateConvStatus(convIntId, 'created', userId);
	}
}
async function processFile(fileToDelete: TDocument) {
	console.log('file to delete: ', fileToDelete);
	const deleteParaRes = await deleteParagraphPinecone_single(
		fileToDelete.document_id,
	);
	console.log('pinecone delete res: ', deleteParaRes);
}
