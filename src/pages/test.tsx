import axios from 'axios';
import { NextPage } from 'next';
import Head from 'next/head';
import { useState } from 'react';
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
				test
			</button>
		</>
	);
};

export default TestPage;
