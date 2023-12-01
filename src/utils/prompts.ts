import { ChatCompletionRequestMessage } from 'openai-edge';

const prompts = {
	presetQuestion(content: string): ChatCompletionRequestMessage {
		return {
			role: 'user',
			content: `아래 지문을 읽고 예상되는 질문을 5개만 작성해줘. 그리고 문장 끝이 항상 "?"로 끝나게 해줘. 언어는 지문의 언어를 따라가줘. 질문마다 '\n'을 사이에 넣어서 분리해줘. 
            지문: ${content}
             `,
		};
	},
};
export default prompts;
