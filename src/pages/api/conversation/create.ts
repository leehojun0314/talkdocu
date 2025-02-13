// import type { VercelRequest, VercelResponse } from '@vercel/node';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { escapeQuotation } from '@/utils/functions';
import { getUserInfoFromSession, insertConv, updateConvStatus } from '@/models';
import fs from 'fs';
import PdfParse from 'pdf-parse';
import { upsertParagraph } from '@/models/pinecone';
import {
  TExtendedFile,
  TExtendedSession,
  TParagraph,
  TUserFromDB,
} from '@/types/types';
import { File } from 'formidable';
import { useFormidable } from '@/lib/formidable';
import { pageRender, processFile } from '@/lib/processFile';
import { insertDocument } from '@/models/document';
import { insertParagraphs } from '@/models/paragraph';
import { generateConvId } from '@/lib/generateConvId';
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'POST') {
    response.status(400).send('bad request');
    return;
  }
  console.log('create called');
  let convIntId;
  let filesFinal: (File | null)[] | null = null;
  let userId;
  let convStringId;
  try {
    const session: TExtendedSession = await getServerSession(
      request,
      response,
      authOptions,
    );
    convStringId = generateConvId();
    const user: TUserFromDB = await getUserInfoFromSession(session);
    if (!user.user_id) {
      throw new Error('Invalid user');
    }
    console.log('request: ', request);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { files, fields } = await useFormidable(request);
    console.log('files: ', files);

    let isError = { status: false, message: '' };
    for (let file of Object.values(files)) {
      if (file) {
        isError = await processFile(file[0]);
        if (isError.status) break;
      }
    }
    if (isError.status) {
      console.log('error: ', isError.message);
      throw new Error(isError.message);
    }
    if (!fields.conversationName) {
      throw new Error('Conversation name is missing.');
    }
    //conversation 생성
    const conversationResult = await insertConv({
      conversationName: fields.conversationName[0],
      userId: user.user_id,
      convStringId,
    });
    console.log('conversation result: ', conversationResult);
    convIntId = conversationResult.recordset[0].id;
    filesFinal = Object.values(files)?.map((fileArr) =>
      fileArr ? fileArr[0] : null,
    );
    userId = user.user_id;
    response.status(201).send({
      message: 'conversation created',
      createdId: convIntId,
    });
  } catch (err) {
    console.log('err: ', err);
    response.status(500).send(err);
  }
  try {
    if (!filesFinal) {
      throw new Error('files final does not exist');
    }
    console.log('filesFinal:', filesFinal);
    for await (let file of Object.values(filesFinal)) {
      const extendedFile = file as unknown as TExtendedFile;
      if (extendedFile?.filepath) {
        const fileUrl = '';
        const buffer = await fs.promises.readFile(extendedFile.filepath);
        // const buffer = await fs.promises.readFile((file as formidable.File).filepath);

        const originalFilename = extendedFile.originalFilename;
        const fileSize = extendedFile.size;
        const insertDocumentResult = await insertDocument({
          documentName: originalFilename || '',
          documentUrl: fileUrl,
          documentSize: fileSize,
          convIntId: convIntId,
        });
        const documentId = insertDocumentResult.recordset[0].document_id;
        const pages: string[] = [];
        const document = await PdfParse(buffer, {
          pagerender: pageRender(pages),
        });

        const paragraphs: TParagraph[] = [];
        for (let i = 0; i < pages.length; i++) {
          paragraphs.push({
            content:
              `(page : ${i + 1})` + escapeQuotation(pages[i]).toLowerCase(),
            // keywords: escapeQuotation(extracted[i].join(', ')),
            pageNumber: i + 1,
            convIntId,
            docuInfo: document.info,
            docuMeta: document.metadata,
            docuId: documentId,
            docuName: originalFilename || '',
          });
        }
        console.log('paragraphs: ', paragraphs);
        await upsertParagraph({
          paragraphs,
          convIntId,
          docuId: documentId,
        });
        await insertParagraphs({ paragraphs, convIntId, documentId });
      }
    }
    await updateConvStatus(convIntId, 'created', userId ?? 0);
  } catch (error) {
    console.log('error: ', error);
    if (convIntId) {
      await updateConvStatus(convIntId, 'error', userId ?? 0);
    }
  }
}
