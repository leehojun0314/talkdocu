export default function chunkToText() {
	const trimStartOfStream = trimStartOfStreamHelper();
	let isFunctionStreamingIn: any;
	return (json: any) => {
		var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j;
		if (
			isChatCompletionChunk(json) &&
			((_c =
				(_b = (_a = json.choices[0]) == null ? void 0 : _a.delta) == null
					? void 0
					: _b.function_call) == null
				? void 0
				: _c.name)
		) {
			isFunctionStreamingIn = true;
			return `{"function_call": {"name": "${
				(_e = (_d = json.choices[0]) == null ? void 0 : _d.delta) == null
					? void 0
					: _e.function_call.name
			}", "arguments": "`;
		} else if (
			isChatCompletionChunk(json) &&
			((_h =
				(_g = (_f = json.choices[0]) == null ? void 0 : _f.delta) == null
					? void 0
					: _g.function_call) == null
				? void 0
				: _h.arguments)
		) {
			const argumentChunk = json.choices[0].delta.function_call.arguments;
			let escapedPartialJson = argumentChunk
				.replace(/\\/g, '\\\\')
				.replace(/\//g, '\\/')
				.replace(/"/g, '\\"')
				.replace(/\n/g, '\\n')
				.replace(/\r/g, '\\r')
				.replace(/\t/g, '\\t')
				.replace(/\f/g, '\\f');
			return `${escapedPartialJson}`;
		} else if (
			isFunctionStreamingIn &&
			(((_i = json.choices[0]) == null ? void 0 : _i.finish_reason) ===
				'function_call' ||
				((_j = json.choices[0]) == null ? void 0 : _j.finish_reason) ===
					'stop')
		) {
			isFunctionStreamingIn = false;
			return '"}}';
		}
		const text = trimStartOfStream(
			isChatCompletionChunk(json) && json.choices[0].delta.content
				? json.choices[0].delta.content
				: isCompletion(json)
				? json.choices[0].text
				: '',
		);
		return text;
	};
}
function trimStartOfStreamHelper() {
	let isStreamStart = true;
	return (text: string) => {
		console.log('text before trim: ', text);
		if (isStreamStart) {
			// text = text.trimStart();
			if (text) isStreamStart = false;
		}
		return text;
	};
}
function isChatCompletionChunk(data: any) {
	return (
		'choices' in data &&
		data.choices &&
		data.choices[0] &&
		'delta' in data.choices[0]
	);
}
function isCompletion(data: any) {
	return (
		'choices' in data &&
		data.choices &&
		data.choices[0] &&
		'text' in data.choices[0]
	);
}
