import createAIChat_edge from '@/lib/createAIChat_edge';
import { selectConversation } from '@/models';
import { getPrompt } from '@/models/prompt';
import { getUserInfoEdge } from '@/utils/getUserInfoEdge';
import MessageGenerator from '@/utils/messageGenerator';
import { ChatCompletionRequestMessage } from 'openai-edge';

export const runtime = 'edge';
export default async function POST(request: Request) {
  try {
    const userInfo = await getUserInfoEdge(request);
    if (!userInfo) {
      return new Response('Invalid user', {
        status: 401,
      });
    }
    const body = await request.json();
    console.log('body: ', body);
    const convStringId = body.convStringId;
    const relatedContent = body.relatedContent;
    const provideContent = body.provideContent;
    const systemMessage = body.systemMessage;
    let prompt;
    if (provideContent) {
      if (systemMessage) {
        prompt = systemMessage + 'Reference content: ' + relatedContent;
      } else {
        prompt = MessageGenerator.systemMessage(relatedContent);
      }
    } else {
      if (systemMessage) {
        prompt = systemMessage;
      } else {
        prompt = '';
      }
    }
    console.log('promt: ', prompt);
    const text = body.prompt;
    if (!convStringId || !text) {
      return new Response('Invalid parameter', { status: 400 });
    }
    // const prompt = MessageGenerator.systemMessage(relatedContent);
    const messages: ChatCompletionRequestMessage[] = [];
    messages.push({
      role: 'system',
      content: prompt,
    });
    messages.push({
      role: 'user',
      content: text,
    });
    const res = await createAIChat_edge(messages, 'deepseek-chat');
    return res;
  } catch (error) {
    return new Response('Error occured', { status: 500 });
  }
}
