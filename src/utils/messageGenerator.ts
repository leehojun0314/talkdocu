import { TMessageFromDB } from '@/types/types';
import { IResult } from 'mssql';
import { ChatCompletionRequestMessage } from 'openai-edge';
import { ChatCompletionMessageParam } from 'openai/resources';

const MessageGenerator = {
  messageSet: (recordset: TMessageFromDB[]) => {
    const messages = [];
    for (let record of recordset) {
      messages.push({
        role: record.sender,
        content: record.message,
      });
    }
    return messages;
  },
  systemMessageDB: (conversationId: number, context: string) => {
    return {
      conversationId: conversationId,
      message: `당신은 다음 내용을 이해하고, 해당 내용에 대해서 질문을 받을 시 친절하게 답변해주는 챗봇입니다. 먼저 어떤 내용을 알고 있는지 간단하게 소개하고, 인사해주세요! 언어는 지문의 언어를 따라가주세요.
			${context}`,
      messageOrder: 0,
      sender: 'system',
    };
  },
  presetSalutation: (context: string) => {
    return {
      role: 'user',
      // content: `You are a chatbot that reads the following text and kindly responds when user ask about the text.
      // When answering, respond according to the language the user is using.
      // First, briefly introduce what you know to the user, and say hi!
      // Please make the language used when greeting the same as the language of the following text.
      // text : ${message}`,
      // content: `다음 지문을 읽고, 챗봇으로써 어떤 내용을 알고있는지 간단하게 소개하는 소개글을 써줘. 언어는 지문의 언어를 따라갈 것.
      // 지문 : This article is about something important.
      // 답 : Greetings! I believe that this article is about something important. How may I help you?
      // 지문 : 이 기사는 중요한 것에 관한 것입니다.
      // 답 : 안녕하세요! 제가 알기로 이 문서는 중요한 내용을 포함하고 있는거 같습니다. 어떻게 도와드릴까요?
      // 지문 : ${message}
      // 답 : `,
      content: `As a chatbot, read the following context and write a brief introduction about what you know. Language should follow the language of context.
			context : This article is about something important.
			answer : Greetings! I believe that this article is about something important. How may I help you?
			context : ${context}
			answer : 
			`,
    };
  },
  systemMessage: (content: string): ChatCompletionMessageParam => {
    return {
      role: 'system',
      content: `당신은 챗봇으로써 다음 내용을 읽고 유저의 질문에 대답해주세요. 내용은 전체 내용에서 질문과 연관된 부분울 추출한 것입니다. 답변에 사용하는 언어는 사용자가 사용하는 언어와 동일하게 해주세요. 질문의 답변이 해당 내용이 없더라도 기반 지식으로 답변해주세요.
			content : ${content}`,
    };
  },
  userMessage: (content: string): ChatCompletionMessageParam => {
    return {
      role: 'user',
      content: content,
    };
  },
  assistantMessage: (content: string): ChatCompletionMessageParam => {
    return {
      role: 'assistant',
      content: content,
    };
  },
  presetQuestion: (content: string): ChatCompletionMessageParam => {
    return {
      role: 'user',
      content: `아래 지문을 읽고 예상되는 질문을 5개만 작성해줘. 그리고 문장 끝이 항상 "?"로 끝나게 해줘. 언어는 지문의 언어를 따라가줘. 질문마다 '\n'을 사이에 넣어서 분리해줘. 
			지문: ${content}
			 `,
    };
  },
  createSummary: (content: string) => {
    return {
      role: 'user',
      content: `다음 지문을 읽고 주요 내용을 300자 내로 요약해줘. 전체적인 내용과 관련 없는 내용은 생략해도 돼. 
			지문 : ${content}`,
    };
  },
};
export default MessageGenerator;
