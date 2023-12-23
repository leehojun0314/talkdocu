import formidable from 'formidable';
import { NextApiRequest } from 'next';

export function useFormidable(req: NextApiRequest): Promise<{
	fields: { conversationName?: string | undefined; convStringId?: string };
	files: formidable.Files;
}> {
	const form = formidable();
	return new Promise((resolve, reject) => {
		form.parse(req, (err, fields, files) => {
			if (err) {
				console.log('formidable err: ', err);
				reject(err);
			} else {
				resolve({ fields, files });
			}
		});
	});
}
