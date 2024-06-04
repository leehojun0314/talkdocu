import axios from 'axios';
import { NextPage } from 'next';
import React, { useEffect, useRef, useState } from 'react';
import { AudioMotionAnalyzer } from 'audiomotion-analyzer';
import { visualizerOptions } from '@/config';
import { Button } from '@mui/material';
import SpeechRecognition, {
	useSpeechRecognition,
} from 'react-speech-recognition';
const TestPage: NextPage = () => {
	const visualizerRef = useRef<HTMLDivElement>(null);
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
		analyzer?.disconnectOutput();
	}
	const { browserSupportsSpeechRecognition, transcript } =
		useSpeechRecognition();

	useEffect(() => {
		const recognition = SpeechRecognition.getRecognition();
		if (recognition) {
			recognition.onspeechend = (event) => {
				console.log('speech end called: ', event);
			};
		}
	}, [browserSupportsSpeechRecognition]);
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
			{/* <hr />
			transcript: {transcript}
			<Button onClick={stopRecognition}>Stop Recognition</Button>
			<Button onClick={startRecognition}>Start recognition</Button>
			<div ref={visualizerRef}></div>
			<audio ref={audioRef}></audio>
			<button onClick={fetchAudio}>Fetch audio</button>
			<button onClick={fetchMic}>Fetch mic</button>
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
			</button> */}
			<Button onClick={postgresTest}>postgres test</Button>
		</>
	);
};

export default TestPage;
