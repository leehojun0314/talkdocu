import axios from 'axios';
import { NextPage } from 'next';
import Head from 'next/head';
import React, { useEffect, useRef, useState } from 'react';
import { useChat, type Message } from 'ai/react';
import { useSession, signIn, signOut, getSession } from 'next-auth/react';
import type { GetServerSideProps } from 'next';
import { TUserFromDB } from '@/types/types';
import axiosAPI from '@/utils/axiosAPI';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { PassThrough } from 'stream';
import ModeIndicator from '@/domain/chat/el/ModeIndicator';
// import { useVisualizer, Visualizer } from 'react-sound-visualizer';
import { AudioMotionAnalyzer } from 'audiomotion-analyzer';
import { visualizerOptions } from '@/config';
import { Button } from '@mui/material';
import SpeechRecognition, {
	useSpeechRecognition,
} from 'react-speech-recognition';
const TestPage: NextPage = () => {
	const { status, data } = useSession();
	// console.log('status: ', status);
	// console.log('data: ', data);
	const [answer, setAnswer] = useState<string>('');
	const {
		messages,
		append,
		data: useChatData,
	} = useChat({
		api: '/api/test?convStringId=testid',
		body: {
			previewToken: 'test data',
		},

		initialMessages: [],
		onFinish(response) {
			console.log('onfinish: ', response);
			console.log('data: ', useChatData);
		},
		onResponse(response) {
			console.log('on response: ', response);
		},
	});
	console.log('messages: ', messages);
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const visualizerRef = useRef<HTMLDivElement>(null);
	const [audio, setAudio] = useState<MediaStream | null>(null);
	// const { start } = useVisualizer(audio, canvasRef.current, {});
	// useEffect(() => {
	// 	axios.get('/api/sqltest').then((response) => {
	// 		console.log('sql useEffectresponse: ', response);
	// 	});
	// }, []);
	function handleInputChange(evt: React.ChangeEvent<HTMLInputElement>) {
		if (evt.currentTarget.files?.length) {
			const files = Array.from(evt.currentTarget.files);
			if (!files.length) {
				return false;
			}
			setSelectedFiles((pre) => {
				return [...pre, ...files];
			});
		}
	}
	function handleSubmit() {
		console.log('click');
		const formData = new FormData();
		if (selectedFiles?.length) {
			console.log('selected files: ', selectedFiles);
			for (let i = 0; i < selectedFiles.length; i++) {
				console.log('sected file: ', selectedFiles[i]);
				formData.append(`file${i}`, selectedFiles[i]);
			}
			console.log('form data: ', formData);
			axios
				.post('/api/conversation/create', formData)
				.then((response) => {
					console.log('response: ', response);
				})
				.catch((err) => {
					console.log('err: ', err);
				});
		} else {
			console.log('no file');
		}
	}
	function onData(data: string, ctrl: AbortController) {
		// if (!answerNode.current) {
		//   return
		// }
		try {
			let parsedData = JSON.parse(data);
			let text = parsedData.choices[0].delta.content;
			console.log('text: ', text);
			let finishReason = parsedData.choices[0]['finish_reason'];
			if (finishReason === 'stop') {
				ctrl.abort();
			}
			if (text) {
				// answerNode.current.innerText = answerNode.current.innerText + text
				setAnswer((pre) => {
					return pre + text;
				});
			}
		} catch (err) {
			console.log(`Failed to parse data: ${data}`);
			if (data !== '[DONE]') {
				// setError(`Failed to parse the response`)
				window.alert('failed to parse the response');
			}
		}
	}
	function aiTest() {
		console.log('test2 clicked');
		let result = '';
		let receivedData = '';
		let lastProcessedIndex = 0;
		const ctrl = new AbortController();
		fetchEventSource('/api/aitest', {
			method: 'POST',
			headers: {
				'Content-Type': 'text/event-stream;charset=utf-8',
			},
			body: 'test body',
			openWhenHidden: true,
			signal: ctrl.signal,
			onmessage(msg) {
				console.log('msg: ', msg);
				if (msg.event === 'FatalError') {
					console.log('msg.data');
				}
				try {
					onData(msg.data, ctrl);
				} catch (err) {
					console.log('aborting');
					ctrl.abort();
				}
			},
			onerror(err) {
				console.log('err: ', err);
			},
		});
	}
	function test3() {
		axios.post(
			'/api/aitest',
			{ test: 'data' },
			{
				onDownloadProgress(evt) {
					console.log('on download progress: ', evt);
					console.log('');
				},
			},
		);
	}
	function postgresTest() {
		axios
			.get('/api/postgresTest')
			.then((response) => {
				console.log('response:', response);
			})
			.catch((err) => {
				console.log('error: ', err);
			});
	}
	function fetchAI() {
		const fetchData = async () => {
			try {
				const response = await fetch('/api/aitest');
				if (!response.body) {
					throw new Error('No readable stream available');
				}

				const reader = response.body.getReader();
				const decoder = new TextDecoder('utf-8');
				let receivedData = '';

				reader.read().then(function processText({ done, value }) {
					if (done) {
						//   setData(receivedData);
						console.log('received data: ', receivedData);
						return;
					}

					receivedData += decoder.decode(value, { stream: true });
					reader.read().then(processText);
				});
			} catch (error) {
				//   setError(error.message);
				//   setLoading(false);
				console.log('error: ', error);
			}
		};
	}
	const audioRef = useRef<HTMLAudioElement>(null);
	const [analyzer, setAnalyzer] = useState<AudioMotionAnalyzer | null>(null);
	useEffect(() => {
		if (audioRef.current && visualizerRef) {
			const an = new AudioMotionAnalyzer(
				visualizerRef.current as HTMLDivElement,
				visualizerOptions,
			);
			setAnalyzer(an);
			// an.connectInput(audioRef.current);
			// return () => {
			// 	if (audioRef.current) {
			// 		an.connectedSources.forEach((source) => {
			// 			an.disconnectInput(source);
			// 		});
			// 	}
			// };
			const url = 'http://localhost:9000/getAudio';
			const audio = new Audio(url);
			audio.src = url;
			audio.crossOrigin = 'anonymous';
			// if (!audioRef.current) return;
			// audioRef.current.src = url;
			// audioRef.current.crossOrigin = 'anonymous';

			// const sourceNode = audioContext.createMediaElementSource(
			// 	audioRef.current,
			// );
			// const audioContext = new AudioContext();
			// const audio = new Audio(url);
			// audio.crossOrigin = 'anonymous';
			// // audio.loop = true
			// const sourceNode = audioContext.createMediaElementSource(audio);
			// const mediaStreamDestination =
			// 	audioContext.createMediaStreamDestination();
			// sourceNode.connect(mediaStreamDestination);
			// audio
			// 	.play()
			// 	.then(() => {
			// 		if (start) {
			// 			start();
			// 		}
			// 	})
			// 	.catch((err) => {
			// 		console.log('err: ', err);
			// 	});
			// // const mediaStream = mediaStreamDestination.stream;
			// // setAudio(mediaStream);
			// audioRef.current.onended = () => {
			// 	console.log('on ended call');
			// 	analyzer?.connectedSources.forEach((source) => {
			// 		console.log('connected source: ', source);
			// 		analyzer.disconnectInput(source);
			// 	});
			// };

			// audioRef.current.play();
			an.connectInput(audio);
		}
	}, [audioRef, visualizerRef]);
	const [url, setUrl] = useState<string>('');
	function fetchAudio() {
		try {
			if (audioRef.current && visualizerRef) {
				// an.connectInput(audioRef.current);
				// an.connectOutput();
				// return () => {
				// 	if (audioRef.current) {
				// 		an.connectedSources.forEach((source) => {
				// 			an.disconnectInput(source);
				// 		});
				// 	}
				// };
				const url = 'http://localhost:9000/getAudio';
				const audio = new Audio(url);
				audio.src = url;
				audio.crossOrigin = 'anonymous';
				// if (!audioRef.current) return;
				// audioRef.current.src = url;
				// audioRef.current.crossOrigin = 'anonymous';

				// const sourceNode = audioContext.createMediaElementSource(
				// 	audioRef.current,
				// );
				// const audioContext = new AudioContext();
				// const audio = new Audio(url);
				// audio.crossOrigin = 'anonymous';
				// // audio.loop = true
				// const sourceNode = audioContext.createMediaElementSource(audio);
				// const mediaStreamDestination =
				// 	audioContext.createMediaStreamDestination();
				// sourceNode.connect(mediaStreamDestination);
				// audio
				// 	.play()
				// 	.then(() => {
				// 		if (start) {
				// 			start();
				// 		}
				// 	})
				// 	.catch((err) => {
				// 		console.log('err: ', err);
				// 	});
				// // const mediaStream = mediaStreamDestination.stream;
				// // setAudio(mediaStream);
				// audioRef.current.onended = () => {
				// 	console.log('on ended call');
				// 	analyzer?.connectedSources.forEach((source) => {
				// 		console.log('connected source: ', source);
				// 		analyzer.disconnectInput(source);
				// 	});
				// };

				// audioRef.current.play();
				analyzer?.connectInput(audio);
				audio.play();
				// an.destroy();
			}
		} catch (error) {
			console.error(error);
		}
	}
	async function fetchMic() {
		const stream = await navigator.mediaDevices.getUserMedia({
			audio: true,
			video: false,
		});
		const micStream = analyzer?.audioCtx.createMediaStreamSource(stream);
		analyzer?.connectInput(micStream as MediaStreamAudioSourceNode);
	}
	const { browserSupportsSpeechRecognition, transcript } =
		useSpeechRecognition({});

	async function startRecognition() {
		return SpeechRecognition.startListening()
			.then((res) => {
				console.log('start recognition res: ', res);
			})
			.catch((err) => {
				console.log('start recognition err: ', err);
			});
	}
	function stopRecognition() {
		SpeechRecognition.stopListening()
			.then((res) => {
				console.log('stop recognition res: ', res);
			})
			.catch((err) => {
				console.log('stop recognition error:', err);
			});
	}
	return (
		<>
			Messages:{' '}
			{/* {messages.map((message, index) => {
				return <div key={index}>{message.content}</div>;
			})} */}
			{messages.length && messages[messages.length - 1].content}
			<hr />
			{/* <ModeIndicator mode={'listening'} /> */}
			{/* <canvas ref={canvasRef} width={350} height={50} /> */}
			{/* <Visualizer audio={audio} mode='current' autoStart>
				{({ canvasRef }) => (
					<>
					</>
				)}
			</Visualizer> */}
			Browser supports speech recognition: {browserSupportsSpeechRecognition}
			transcript: {transcript}
			<Button onClick={stopRecognition}>Stop Recognition</Button>
			<Button onClick={startRecognition}>Start recognition</Button>
			<div ref={visualizerRef}></div>
			<audio ref={audioRef}></audio>
			<button onClick={fetchAudio}>Fetch audio</button>
			<button onClick={fetchMic}>Fetch mic</button>
			<button
				onClick={() => {
					// const temp = 'temptoken';
					// console.log('temp: ', temp);
					// // setjwtToken(temp);
					// const newHeader = new Headers();
					// newHeader.append('authorization', `Bearer ${temp}`);
					// setjwtToken(temp);
					append(
						{ id: '123', content: 'asd', role: 'user' },
						{
							options: {
								headers: {
									Authorization: 'newauth',
								},
								body: {
									message: 'data2',
								},
							},
						},
					)
						.then((response) => {
							console.log('append response:', response);
						})
						.catch((err) => {
							console.log('append err: ', err);
						});
				}}
			>
				test1
			</button>
			<button onClick={aiTest}>aiTest</button>
			<button onClick={test3}>test3</button>
			<button
				onClick={() => {
					signIn();
				}}
			>
				login
			</button>
			<button
				onClick={() => {
					signOut();
				}}
			>
				logout
			</button>
			<button
				onClick={() => {
					axios.get('/api/sqltest').then((response) => {
						console.log('sql useEffectresponse: ', response);
					});
				}}
			>
				sql test
			</button>
			<button
				onClick={() => {
					axios
						.get('/api/hello')
						.then((response) => {
							console.log('response: ', response);
						})
						.catch((err) => {
							console.log('err: ', err);
						});
				}}
			>
				session test
			</button>
			<input
				type='file'
				multiple={true}
				onChange={handleInputChange}
			></input>
			<button onClick={handleSubmit}>upload test</button>
			<button onClick={postgresTest}>postgres test</button>
		</>
	);
};

export default TestPage;
