import { encode } from 'gpt-3-encoder';
import { ChatCompletionMessageParam } from 'openai/resources';
function calculateTokens(str: string) {
	const encoded = encode(str);
	let tokenCount = 0;
	for (let token of encoded) {
		tokenCount++;
	}
	return tokenCount;
	// return calculateMaxTokens({ prompt: str, modelName: 'gpt-3.5-turbo' });
}
export function optimizingPrompt(
	prompts: Array<any>,
	exclusives: string,
	tokenLimit: number,
): Array<ChatCompletionMessageParam> {
	let totalTokenCount = 0;
	let exclusiveToken = calculateTokens(exclusives);
	const copiedPrompts = JSON.parse(JSON.stringify(prompts));
	if (copiedPrompts.length) {
		for (let prompt of copiedPrompts) {
			const content = prompt.content;
			totalTokenCount += calculateTokens(content);
		}
	}

	while (totalTokenCount > tokenLimit - exclusiveToken) {
		const item = copiedPrompts.shift();
		if (item?.content) {
			totalTokenCount -= calculateTokens(item.content);
		} else {
			break;
		}
	}

	return copiedPrompts;
}
