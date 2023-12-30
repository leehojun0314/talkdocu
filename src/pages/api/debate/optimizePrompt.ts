import { optimizingPrompt } from '@/lib/optimizingPrompt';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	request: NextApiRequest,
	response: NextApiResponse,
) {
	console.log('optimized prompt : ', request.body);

	const { prompts, exclusives, tokenLimit } = request.body;
	if (!prompts || !exclusives || !tokenLimit) {
		response.status(400).send('Invalid parameter');
		return;
	}
	const optimizedPrompts = optimizingPrompt(prompts, exclusives, tokenLimit);
	response.send({ optimizedPrompts });
}
