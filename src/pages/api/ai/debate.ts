import { configs } from '@/config';
import createAIChat_edge from '@/lib/createAIChat_edge';
// import { optimizingPrompt } from '@/lib/optimizingPrompt';

import { TDebate, TDebateMessage, TProvider, TUserFromDB } from '@/types/types';
import { getUserInfoEdge } from '@/utils/getUserInfoEdge';
import MessageGenerator from '@/utils/messageGenerator';
import { ChatCompletionRequestMessage } from 'openai-edge';

export const runtime = 'edge';
export default async function POST(request: Request) {
  try {
    const user = await getUserInfoEdge(request);
    console.log('userInfo: ', user);
    if (!user) {
      return new Response('Invalid user', {
        status: 401,
      });
    }

    console.log('user: ', user);
    const {
      prompt: text,
      debate,
      optimizedMessages,
    }: {
      prompt: string;
      debate: TDebate;
      optimizedMessages: TDebateMessage[];
    } = await request.json();
    const prompt: ChatCompletionRequestMessage[] = [];
    prompt.push(
      MessageGenerator.systemMessage(
        debate.refer_content,
      ) as ChatCompletionRequestMessage,
    );
    prompt.push(
      MessageGenerator.userMessage(
        debate.question_content,
      ) as ChatCompletionRequestMessage,
    );
    prompt.push(
      MessageGenerator.assistantMessage(
        debate.answer_content,
      ) as ChatCompletionRequestMessage,
    );
    // const optimizedHistory = await optimizingPrompt(
    // 	messages,
    // 	debate.refer_content,
    // 	configs.debateTokenLimit,
    // );
    // console.log('optimized: ', optimizedHistory);
    prompt.concat(
      optimizedMessages.map((debateMessage) => {
        switch (debateMessage.sender) {
          case 'user': {
            return MessageGenerator.userMessage(
              debateMessage.content as string,
            ) as ChatCompletionRequestMessage;
          }
          case 'assistant': {
            return MessageGenerator.assistantMessage(
              debateMessage.content ?? '',
            ) as ChatCompletionRequestMessage;
          }
          default: {
            return {
              content: '',
              role: 'user',
            };
          }
        }
      }),
    );
    prompt.push(
      MessageGenerator.userMessage(text) as ChatCompletionRequestMessage,
    );
    console.log('prompt: ', prompt);
    const res = await createAIChat_edge(prompt, 'deepseek-chat');
    return res;
  } catch (error) {
    console.log('error:', error);

    return new Response('Error occured', { status: 500 });
  }
}
