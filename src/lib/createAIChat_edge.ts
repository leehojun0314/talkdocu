import { OpenAIStream, StreamingTextResponse } from 'ai';
import {
  ChatCompletionRequestMessage,
  Configuration,
  CreateChatCompletionRequest,
  OpenAIApi,
} from 'openai-edge';

export default async function createAIChat_edge(
  messages: ChatCompletionRequestMessage[],
  model: CreateChatCompletionRequest['model'],
) {
  console.log('messages: ', messages);
  const configuration = new Configuration({
    apiKey: process.env.DEEPSEEK_API_KEY,
    basePath: 'https://api.deepseek.com/v1',
  });
  const openai = new OpenAIApi(configuration);
  const res = await openai.createChatCompletion({
    model,
    messages,
    temperature: 0.7,
    stream: true,
  });
  const stream = OpenAIStream(res);
  return new StreamingTextResponse(stream);
}
