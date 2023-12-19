import axios from 'axios';
import { NextPage } from 'next';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { useChat, type Message } from 'ai/react';
import { useSession, signIn, signOut, getSession } from 'next-auth/react';
import type { GetServerSideProps } from 'next';
import { TUserFromDB } from '@/types/types';
import axiosAPI from '@/utils/axiosAPI';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import { PassThrough } from 'stream';
const TestPage: NextPage = () => {
	const { status, data } = useSession();
	const [jwtToken, setjwtToken] = useState<string>('');
	// console.log('status: ', status);
	// console.log('data: ', data);
	const [answer, setAnswer] = useState<string>('');
	// const {
	// 	messages,
	// 	append,
	// 	data: useChatData,
	// } = useChat({
	// 	api: '/api/aitest?convStringId=testid',
	// 	body: {
	// 		previewToken: 'test data',
	// 	},
	// 	initialMessages: [],
	// 	onFinish(response) {
	// 		console.log('onfinish: ', response);
	// 		console.log('data: ', useChatData);
	// 	},
	// 	onResponse(response) {
	// 		console.log('on response: ', response);
	// 	},
	// });
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
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
	function test2() {
		console.log('test2 clicked');
		let result = '';
		let receivedData = '';
		let lastProcessedIndex = 0;
		const ctrl = new AbortController();
		fetchEventSource('/api/aitest', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
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
			'/api/openaiTest',
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
	return (
		<>
			<Head>
				<title>Terms</title>
			</Head>
			Messages:{' '}
			{/* {messages.map((message, index) => {
				return <div key={index}>{message.content}</div>;
			})} */}
			{answer}
			<hr />
			<button
				onClick={() => {
					// const temp = 'temptoken';
					// console.log('temp: ', temp);
					// // setjwtToken(temp);
					// const newHeader = new Headers();
					// newHeader.append('authorization', `Bearer ${temp}`);
					// setjwtToken(temp);
					// append(
					// 	{ id: '123', content: 'asd', role: 'user' },
					// 	{
					// 		options: {
					// 			headers: {
					// 				Authorization: 'newauth',
					// 			},
					// 			body: {
					// 				test: 'data2',
					// 			},
					// 		},
					// 	},
					// )
					// 	.then((response) => {
					// 		console.log('append response:', response);
					// 	})
					// 	.catch((err) => {
					// 		console.log('append err: ', err);
					// 	});
				}}
			>
				test1
			</button>
			<button onClick={test2}>test2</button>
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
