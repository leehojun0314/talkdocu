import {
	createParser,
	EventSourceParser,
	ParsedEvent,
	ParseEvent,
} from 'eventsource-parser';
import chunkToText from './chunkToText';

export function createMessageTransformer() {
	let eventSourceParser: EventSourceParser;
	let textDecoder = new TextDecoder();

	return new TransformStream({
		async start(controller) {
			eventSourceParser = createParser((event: ParseEvent) => {
				if (
					'data' in event &&
					event.type === 'event' &&
					event.data === '[DONE]' // Replicate doesn't send [DONE] but does send a 'done' event
					// @see https://replicate.com/docs/streaming
				) {
					controller.terminate();
					return;
				}
				if ('data' in event) {
					const parsedMessage = parser(event.data);
					console.log('parsed message: ', parsedMessage);
					if (parsedMessage) {
						controller.enqueue(parsedMessage);
					}
				}
			});
		},
		async transform(chunk) {
			eventSourceParser.feed(textDecoder.decode(chunk));
		},
	});
}
const parser = (data: ParsedEvent['data']) => {
	const extract = chunkToText();
	return extract(JSON.parse(data));
};
