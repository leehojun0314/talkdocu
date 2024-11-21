import formidable from 'formidable';
import { NextApiRequest } from 'next';

export function useFormidable(req: NextApiRequest): Promise<{
  fields: { conversationName?: string | undefined; convStringId?: string };
  files: formidable.Files;
}> {
  const form = formidable({
    multiples: true, // 다중 파일 업로드 허용
    maxFileSize: 100 * 1024 * 1024, // 100MB (필요에 따라 조정)
  });
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
