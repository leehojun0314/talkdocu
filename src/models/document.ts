import mssql from 'mssql';
import { sqlConnectionPool } from '.';

export async function insertDocument({
	documentName,
	documentUrl,
	documentSize,
	convIntId,
}: {
	documentName: string;
	documentUrl: string;
	documentSize: number;
	convIntId: number;
}) {
	return (await sqlConnectionPool.connect())
		.request()
		.input('document_name', documentName)
		.input('document_url', documentUrl)
		.input('document_size', documentSize)
		.input('conversation_id', convIntId)
		.query(
			`INSERT INTO Document (document_name, document_url, document_size, conversation_id) 
						OUTPUT INSERTED.document_id VALUES (@document_name, @document_url, @document_size, @conversation_id)`,
		);
}
export async function selectDocument(docuId: number, convIntId: number) {
	return (await sqlConnectionPool.connect())
		.request()
		.query(
			`SELECT * FROM Document WHERE conversation_id = '${convIntId}' AND document_id = '${docuId}'`,
		);
}
export async function deleteDocument(docuId: number, convIntId: number) {
	const transaction = (await sqlConnectionPool.connect()).transaction();
	await transaction.begin();
	await transaction
		.request()
		.input('convIntId', convIntId)
		.input('docuId', docuId).query(`
		DELETE FROM Paragraph WHERE document_id=@docuId AND conversation_id=@convIntId;
		DELETE FROM Document WHERE document_id=@docuId AND conversation_id=@convIntId;
		`);

	return transaction.commit();
}
