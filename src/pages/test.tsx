import axios from 'axios';
import { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useChat, type Message } from 'ai/react';
const TestPage: NextPage = () => {
	const { messages, append } = useChat({
		api: '/api/test',
		body: {
			previewToken: 'test data',
		},
		onFinish(response) {
			console.log(response);
		},
	});
	useEffect(() => {
		axios.get('/api/sqltest').then((response) => {
			console.log('sql useEffectresponse: ', response);
		});
	});
	function test2() {
		console.log('test2 clicked');
		axios
			.get('/api/sqltest')
			.then((response) => {
				console.log('response : ', response);
			})
			.catch((err) => {
				console.log('err: ', err);
			});
	}
	console.log('messages: ', messages);
	return (
		<>
			<Head>
				<title>Terms</title>
			</Head>
			Messages:{' '}
			{messages.map((message, index) => {
				console.log('message: ', message);
				return <div key={index}>{message.content}</div>;
			})}
			<hr />
			<button
				onClick={() => {
					append({ id: '123', content: 'asd', role: 'user' });
				}}
			>
				test1
			</button>
			<button onClick={test2}>test2</button>
		</>
	);
};

export default TestPage;
