import axios from 'axios';
import { NextPage } from 'next';
import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { useChat, type Message } from 'ai/react';
import { useSession, signIn, signOut, getSession } from 'next-auth/react';
import type { GetServerSideProps } from 'next';
import { TUserFromDB } from '@/types/types';
import { getUserInfoFromSession, selectConversation } from '@/models';

export const getServerSideProps = (async (context: any) => {
	const session = await getSession(context);
	console.log('session : ', session);

	return {
		props: {
			test: 'test',
		},
	};
}) satisfies GetServerSideProps<{ test: string }>;
const TestPage: NextPage = () => {
	const { status, data } = useSession();
	const [jwtToken, setjwtToken] = useState<string>('');
	// console.log('status: ', status);
	// console.log('data: ', data);
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
			{messages.map((message, index) => {
				return <div key={index}>{message.content}</div>;
			})}
			<hr />
			<button
				onClick={() => {
					const temp = 'temptoken';
					console.log('temp: ', temp);
					// setjwtToken(temp);
					const newHeader = new Headers();
					newHeader.append('authorization', `Bearer ${temp}`);
					setjwtToken(temp);
					append(
						{ id: '123', content: 'asd', role: 'user' },
						{
							options: {
								headers: {
									Authorization: 'newauth',
								},
								body: {
									test: 'data2',
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
			<button onClick={test2}>test2</button>
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
