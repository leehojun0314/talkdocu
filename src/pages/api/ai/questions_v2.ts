import createAIChat_edge from '@/lib/createAIChat_edge';
import { getUserInfoEdge } from '@/utils/getUserInfoEdge';
import MessageGenerator from '@/utils/messageGenerator';
import { RequestContext } from '@vercel/edge';
import { ChatCompletionRequestMessage } from 'openai-edge';

export const runtime = 'edge';
export default async function POST(request: Request, context: RequestContext) {
  try {
    const userInfo = await getUserInfoEdge(request);
    console.log('userInfo: ', userInfo);
    if (!userInfo) {
      throw new Error('Invalid user');
    }
    const body = await request.json();
    const convStringId = body.convStringId;
    const docuId = body.docuId;

    if (!convStringId || !docuId) {
      throw new Error('Parameter Error');
    }
    const data = JSON.stringify({
      checkFromMe: 'me',
      convStringId,
      docuId,
    });
    console.log('flag 1');
    const paraRes = await fetch(
      process.env.API_ENDPOINT + '/api/paragraph/getParagraphQuestion',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data,
        mode: 'same-origin',
        cache: 'no-cache',
      },
    );
    console.log('flag 2');
    const { joinedParagraphs } = await paraRes.json();
    console.log('joined paragraphs: ', joinedParagraphs);
    const prompt = MessageGenerator.presetQuestion(joinedParagraphs as string);

    const messages: ChatCompletionRequestMessage[] = [];
    messages.push({
      role: 'user',
      content: prompt.content as string,
    });

    const res = await createAIChat_edge(messages, 'gpt-4o');

    return res;
  } catch (error) {
    console.log('error: ', error);
    return new Response('Error occured', {
      status: 500,
    });
  }
}
