import { TrootState } from '@/redux/reducers';
import { login } from '@/redux/reducers/actions';
import {
	TChatMode,
	TConversation,
	TDebate,
	TDebateMessage,
	TDocument,
	TExistFile,
	TExtendedAuthData,
	TExtendedMessage,
	TExtendedSession,
	TMessage,
	TOptionDialog,
	TProvider,
	TQuestion,
	TReferenceDoc,
} from '@/types/types';
import axiosAPI from '@/utils/axiosAPI';
import checkFileExtension from '@/utils/checkFileType';
import { useChat, type Message } from 'ai/react';
import axios from 'axios';
import { error } from 'console';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
// import jsonwebtoken from 'jsonwebtoken';
const jsonwebtoken = require('jsonwebtoken');
// import { generateJWT } from '@/utils/functions';
import { DefaultSession, Session } from 'next-auth';

export default function useChatViewV3() {
	const { status: authStatus, data: authData } = useSession();
	// const newAuthData: TExtendedAuthData | null = authData;
	const [conversation, setConversation] = useState<TConversation>();
	const [messages, setMessages] = useState<TMessage[]>([]);
	const [questions, setQuestions] = useState<TQuestion[]>();
	const [isLoadingQuestion, setIsLoadingQuestion] = useState<boolean>(false);
	const [documents, setDocuments] = useState<TDocument[]>([]);
	const [docuForQuestion, setDocuForQuestion] = useState<number>();
	const [input, setInput] = useState<string>('');
	const [salutation, setSalutation] = useState<string>();
	const [answer, setAnswer] = useState<{
		isOpen: boolean;
		content: string;
	}>({
		isOpen: false,
		content: '',
	});
	// const [isQuestionBtn, setQuestionBtn] = useState<boolean>(false);
	const messageBoxRef = useRef<HTMLDivElement>(null);
	const [isScroll, setIsScroll] = useState<boolean>(false);
	const [isBottom, setIsBottom] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [optionDialog, setOptionDialog] = useState<TOptionDialog>({
		isOpen: false,
	});

	//debate
	const [chatMode, setChatMode] = useState<TChatMode>('QA');
	const [debate, setDebate] = useState<TDebate>({
		debate_id: 0,
		question_id: 0,
		answer_id: 0,
		refer_content: '',
		question_content: '',
		answer_content: '',
	});
	const [debateMessages, setDebateMessages] = useState<TDebateMessage[]>([]);
	const [isLoadingDebate, setIsLoadingDebate] = useState<boolean>(false);
	const debateMessageBoxRef = useRef<HTMLDivElement>(null);
	const [isScrollDebate, setIsScrollDebate] = useState<boolean>(false);
	const [isBottomDebate, setIsBottomDebate] = useState<boolean>(false);
	const [isReferOpen, setIsReferOpen] = useState<boolean>(false);

	//add dialog
	const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
	const [addFiles, setAddFiles] = useState<File[]>([]);
	const [addDiaExistFiles, setAddDiaExistFiles] = useState<TExistFile[]>([]);
	const [addDiaProgress, setAddDiaProgress] = useState<number>(0);
	const [addDiaProgressMessage, setAddDiaProgressMessage] =
		useState<string>('');

	//alert dialog
	const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
	const [alertContent, setAlertContent] = useState<string>('');
	function onAlertClose() {
		setIsAlertOpen(false);
	}
	//1. 로그인 체크
	//2. 라우터 체크
	//2.1 라우터에 conv 없으면 로그인 정보의 last_conv 참조 (deprecated)
	//2.2 라우터에 conv 있으면 해당 conv 로드 후 로그인 정보 변경
	const router = useRouter();
	const [loadDocuments, toggleLoadDocuments] = useState<boolean>(false);
	const [JWTToken, setJWTToken] = useState<string>('');
	//question
	const {
		messages: questionMessages,
		append: appendQuestion,
		setMessages: setQuestionMessages,
		data,
	} = useChat({
		api: '/api/ai/questions',

		body: {
			convId: router.query.convId,
			docuId: docuForQuestion,
		},
		async onFinish(response) {
			console.log('on finish');
			console.log('data: ', data);
			setQuestionMessages([]);

			setAnswer({
				isOpen: false,
				content: '',
			});
			const newQuestionMessage: TMessage = {
				message: response.content,
				message_id: messages.length,
				sender: 'assistant',
				is_question: 1,
				question_doc_name: data.questionDocName,
			};
			setMessages((pre) => [...pre, newQuestionMessage]);
		},
		async onResponse(response) {
			console.log('use chat on response: ', response);
		},
		async onError(error) {
			console.log('error: ', error);
			window.alert('OpenAI error occured');
		},
	});

	useEffect(() => {
		console.log('router: ', router);
		if (!router.isReady) {
			return;
		}
		if (!router.query.convId) {
			window.alert('Bad Request');
			return;
		}
		if (authStatus === 'unauthenticated') {
			window.alert('You need to login first.');
			router.push('/login');
			return;
		} else if (authStatus === 'loading') {
			setIsLoading(true);
		} else if (authStatus === 'authenticated') {
			axios
				.get(`/api/conversation/getOne?convStringId=${router.query.convId}`)
				.then((response) => {
					if (response.data.conversation.status !== 'created') {
						return Promise.reject('Conversation status error');
					}
					console.log('get conv one response: ', response);
					setConversation(response.data.conversation);
					setSalutation(response.data.conversation.salutation);
					setMessages(response.data.messages);
					setDocuments(response.data.documents);
					if (documents.length) {
						setDocuForQuestion(documents[0].document_id);
					}
					setIsScroll(true);
					setAddDiaExistFiles(
						documents.map((el) => {
							return { file: el, status: 'exist' };
						}),
					);
				})
				.catch((error) => {
					console.log('error: ', error);
				})
				.finally(() => {
					setIsLoading(false);
				});
		}
	}, [router, authStatus]);
	useEffect(() => {
		if (questionMessages.length) {
			setAnswer({
				isOpen: true,
				content: questionMessages[questionMessages.length - 1].content,
			});
		}
	}, [questionMessages]);
	useEffect(() => {
		if (loadDocuments) {
			setIsLoading(true);
			axios
				.get(`/api/conversation/getOne`)
				.then((response) => {
					const documents: TDocument[] = response.data.documents;
					setDocuments(documents);
					if (documents.length) {
						setDocuForQuestion(documents[0].document_id);
						setAddDiaExistFiles(
							documents.map((el) => {
								return { file: el, status: 'exist' };
							}),
						);
					} else {
						setAddDiaExistFiles([]);
					}
				})
				.catch((error) => {
					console.log('load documents error: ', error);
				})
				.finally(() => {
					toggleLoadDocuments(false);
					setIsLoading(false);
				});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [loadDocuments]);

	const scrollToBottom = useCallback(() => {
		if (messageBoxRef.current) {
			messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
		}
	}, [messageBoxRef]);
	const scrollToTop = useCallback(() => {
		if (messageBoxRef.current) {
			messageBoxRef.current.scrollTop = 0;
		}
	}, [messageBoxRef]);
	const scrollToBottomDebate = useCallback(() => {
		if (debateMessageBoxRef.current) {
			debateMessageBoxRef.current.scrollTop =
				debateMessageBoxRef.current.scrollHeight;
		}
	}, [debateMessageBoxRef]);
	const scrollToTopDebate = useCallback(() => {
		if (debateMessageBoxRef.current) {
			debateMessageBoxRef.current.scrollTop = 0;
		}
	}, [debateMessageBoxRef]);
	useEffect(() => {
		if (isScroll) {
			scrollToBottom();
			setIsScroll(false);
		}
	}, [isScroll, isBottom, scrollToBottom]);
	useEffect(() => {
		if (isBottom && isLoading) {
			scrollToBottom();
		}
	}, [isBottom, answer, isLoading, scrollToBottom]);

	useEffect(() => {
		if (isScrollDebate) {
			scrollToBottomDebate();
			setIsScrollDebate(false);
		}
	}, [isScrollDebate, isBottomDebate, scrollToBottomDebate]);
	useEffect(() => {
		if (isBottomDebate && isLoading) {
			scrollToBottomDebate();
		}
	}, [isBottomDebate, answer, isLoading, scrollToBottomDebate]);

	const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
		const target = event.target as HTMLDivElement;
		const isBottom =
			target.scrollHeight - target.scrollTop === target.clientHeight;

		if (isBottom) {
			// 여기에 필요한 작업을 추가하세요.
			setIsBottom(true);
		} else {
			setIsBottom(false);
		}
	}, []);
	const handleScrollDebate = useCallback(
		(event: React.UIEvent<HTMLDivElement>) => {
			const target = event.target as HTMLDivElement;
			const isBottom =
				target.scrollHeight - target.scrollTop === target.clientHeight;

			if (isBottom) {
				// 여기에 필요한 작업을 추가하세요.
				setIsBottomDebate(true);
			} else {
				setIsBottomDebate(false);
			}
		},
		[],
	);

	function handleClickDebate(messageId: number) {
		return (evt: React.MouseEvent<HTMLButtonElement>) => {
			console.log('message id : ', messageId);
			setIsLoading(true);
			setIsLoadingDebate(true);
			axios
				.get(`/api/debate/getOne?answerId=${messageId}`)
				.then((response) => {
					console.log('response:', response);
					setChatMode('Debate');
					setDebate(response.data.debate as TDebate);
					setDebateMessages(response.data.messages as TDebateMessage[]);
				})
				.catch((error) => {
					console.log('err: ', error);
				})
				.finally(() => {
					setIsLoading(false);
					setIsLoadingDebate(false);
				});
		};
	}
	function toggleReferContent() {
		if (isReferOpen) {
			setIsReferOpen(false);
		} else {
			setIsReferOpen(true);
		}
	}
	function handleChatMode(chatMode: TChatMode) {
		return (evt: React.MouseEvent<HTMLButtonElement>) => {
			setChatMode(chatMode);
		};
	}
	function handleOptionClick(evt: React.MouseEvent<HTMLButtonElement>) {
		console.log('click');
		setOptionDialog((pre) => {
			return {
				...pre,
				isOpen: true,
			};
		});
	}
	function handleOptionToggle() {
		setOptionDialog((pre) => {
			return {
				...pre,
				isOpen: !pre.isOpen,
			};
		});
	}
	function handleChangeDocuSelect(evt: React.ChangeEvent<HTMLSelectElement>) {
		setDocuForQuestion(Number(evt.currentTarget.value));
	}
	function handleGenerateQuestion_V3(
		evt: React.MouseEvent<HTMLButtonElement>,
	) {
		console.log('generate question');

		setAnswer({
			isOpen: true,
			content: '',
		});

		appendQuestion(
			{
				id: messages.length.toString(),
				role: 'user',
				content: input,
			},
			// {
			// 	options: {
			// 		headers: {
			// 			Authorization: response.data,
			// 		},
			// 	},
			// },
		);
	}
	// function handleGenerateQuestionV2(
	// 	event: React.MouseEvent<HTMLButtonElement>,
	// ) {
	// 	event.preventDefault();
	// 	event.stopPropagation();
	// 	if (isLoading) {
	// 		return;
	// 	}
	// 	setAnswer({
	// 		isOpen: true,
	// 		content: '',
	// 	});
	// 	setIsScroll(true);
	// 	setIsLoading(true);
	// 	let receivedData = '';
	// 	let lastProcessedIndex = 0;
	// 	let result = '';
	// 	let questionDocName = '';
	// 	axiosAPI({
	// 		method: 'POST',
	// 		url: `/message/questions/v3?convStringId=${router.query.convId}&docuId=${docuForQuestion}`,
	// 		onDownloadProgress: (progress) => {
	// 			receivedData +=
	// 				progress.event.currentTarget.responseText.slice(
	// 					lastProcessedIndex,
	// 				);
	// 			lastProcessedIndex =
	// 				progress.event.currentTarget.responseText.length;
	// 			const rawDataArray = receivedData.split('#');
	// 			let parsedText = '';
	// 			rawDataArray.forEach((rawData, index) => {
	// 				if (index === rawDataArray.length - 1) {
	// 					receivedData = rawData;
	// 				} else {
	// 					const parsedData = JSON.parse(rawData);
	// 					parsedText += parsedData.text;
	// 					questionDocName = parsedData.documentName;
	// 				}
	// 			});
	// 			setAnswer((pre) => {
	// 				return {
	// 					isOpen: true,
	// 					content: pre.content + parsedText,
	// 				};
	// 			});
	// 			result += parsedText;
	// 		},
	// 	})
	// 		.then((questionRes) => {
	// 			setAnswer({ isOpen: false, content: '' });

	// 			setQuestions(questionRes.data.questions);
	// 			const questionsStr = questionRes.data.questions;
	// 			const documentForQuestion = questionRes.data.documentName;
	// 			setMessages((pre : Message[]) => {
	// 				return [
	// 					...pre,
	// 					{
	// 						message: result,
	// 						id: pre.length.toString(),
	// 						sender: 'assistant',
	// 						is_question: 1,
	// 						question_doc_name: questionDocName,
	// 					} as TExtendedMessage,
	// 				];
	// 			});
	// 		})
	// 		.catch((err) => {
	// 			console.log('get question error: ', err);
	// 			if (err.response?.status === 401) {
	// 				router.reload();
	// 			}
	// 			setAnswer({ isOpen: true, content: err.message });
	// 		})
	// 		.finally(() => {
	// 			setIsLoading(false);
	// 			// setIsLoadingQuestion(false);
	// 		});
	// }
	function handleSubmit_V2(input: string) {
		console.log('handle submit v2 : ', input);
	}
	// function handleSubmit(input: string) {
	// 	if (!input.length) {
	// 		return;
	// 	}
	// 	if (authStatus === 'authenticated') {
	// 		//add my message
	// 		if (messages) {
	// 			setMessages((pre) => {
	// 				if (pre) {
	// 					return [
	// 						...pre,
	// 						{
	// 							message: input,
	// 							message_id: pre.length,
	// 							sender: 'user',
	// 							is_question: 0,
	// 							question_doc_name: null,
	// 						},
	// 					];
	// 				} else {
	// 					return pre;
	// 				}
	// 			});
	// 		} else {
	// 			setMessages([
	// 				{
	// 					message: input,
	// 					message_id: 0,
	// 					sender: 'user',
	// 					is_question: 0,
	// 					question_doc_name: null,
	// 				},
	// 			]);
	// 		}
	// 		setAnswer({
	// 			isOpen: true,
	// 			content: '',
	// 		});
	// 		setIsScroll(true);
	// 		setIsLoading(true);
	// 		let receivedData = '';
	// 		let lastProcessedIndex = 0;
	// 		let result = '';
	// 		let referenceDocs: TReferenceDoc[] = [];
	// 		axiosAPI({
	// 			method: 'POST',
	// 			url: '/message/v6',
	// 			data: {
	// 				text: input,
	// 				conversationId: router.query.convId,
	// 			},
	// 			onDownloadProgress: (progress) => {
	// 				receivedData +=
	// 					progress.event.currentTarget.responseText.slice(
	// 						lastProcessedIndex,
	// 					);
	// 				lastProcessedIndex =
	// 					progress.event.currentTarget.responseText.length;
	// 				const rawDataArray = receivedData.split('#');
	// 				let parsedText = '';
	// 				rawDataArray.forEach((rawData, index) => {
	// 					if (index === rawDataArray.length - 1) {
	// 						receivedData = rawData;
	// 					} else {
	// 						const parsedData = JSON.parse(rawData);
	// 						// console.log('parsed data: ', parsedData);
	// 						parsedText += parsedData.text;
	// 						referenceDocs = parsedData.referenceDocs;
	// 					}
	// 				});
	// 				// console.log('parsed text: ', parsedText);
	// 				setAnswer((pre) => {
	// 					return {
	// 						isOpen: true,
	// 						content: pre.content + parsedText,
	// 					};
	// 				});

	// 				result += parsedText;
	// 			},
	// 		})
	// 			.then((submitRes) => {
	// 				console.log('submit res: ', submitRes);
	// 				return axiosAPI({
	// 					method: 'GET',
	// 					url: `/message/v4?convId=${router.query.convId}`,
	// 				});
	// 			})
	// 			.then((getMessageRes) => {
	// 				console.log('get message res: ', getMessageRes);

	// 				setAnswer({ isOpen: false, content: '' });

	// 				setMessages(getMessageRes.data.messages);
	// 			})
	// 			.catch((err) => {
	// 				console.log('err:', err);
	// 				if (err.response?.status === 401) {
	// 					router.reload();
	// 				}
	// 				setAnswer({ isOpen: true, content: 'error occured' });
	// 			})
	// 			.finally(() => {
	// 				setIsLoading(false);
	// 			});
	// 	} else {
	// 		console.log('you are not logged in');
	// 		router.push('/login');
	// 	}
	// }

	function handleSubmitDebate(input: string) {
		if (authStatus === 'authenticated') {
			//add my message
			setDebateMessages((pre) => {
				const newEl: TDebateMessage = {
					id: 0,
					content: input,
					sender: 'user',
					debate_id: debate.debate_id,
					conversation_id: conversation?.conversation_id,
					time: null,
				};
				return [...pre, newEl];
			});
			setAnswer({
				isOpen: true,
				content: '',
			});
			setIsScroll(true);
			setIsLoading(true);
			axiosAPI({
				method: 'POST',
				url: '/debate/message',
				data: {
					text: input,
					convStringId: router.query.convId,
					debateId: debate.debate_id,
					answerId: debate.answer_id,
				},
				onDownloadProgress: (progress) => {
					const text = progress.event.currentTarget.response;
					setAnswer({
						isOpen: true,
						content: text,
					});
				},
			})
				.then((submitRes) => {
					console.log('submit res: ', submitRes);
					return axiosAPI({
						method: 'GET',
						url: `/debate/message?answerId=${debate.answer_id}`,
					});
				})
				.then((getMessageRes) => {
					console.log('get message res: ', getMessageRes);
					// const message =
					// 	result +
					// 	(referenceDocs.length > 0
					// 		? '\n' + referenceDocsToString(referenceDocs)
					// 		: '');
					setAnswer({ isOpen: false, content: '' });
					// setMessages((pre) => {
					// 	if (pre) {
					// 		return [
					// 			...pre,
					// 			{
					// 				message: message,
					// 				message_id: pre.length,
					// 				sender: 'assistant',
					// 				is_question: 0,
					// 				question_doc_name: null,
					// 			},
					// 		];
					// 	} else {
					// 		return [
					// 			{
					// 				message: message,
					// 				message_id: 1,
					// 				sender: 'assistant',
					// 				is_question: 0,
					// 				question_doc_name: null,
					// 			},
					// 		];
					// 	}
					// });
					setDebateMessages(getMessageRes.data.messages);
				})
				.catch((err) => {
					console.log('err:', err);
					if (err.response?.status === 401) {
						router.reload();
					}
					setAnswer({ isOpen: true, content: 'error occured' });
				})
				.finally(() => {
					setIsLoading(false);
				});
		} else {
			console.log('you are not logged in');
			router.push('/login');
		}
	}
	// const [questions, setQuestions] = useState<
	function handleQuestionClick(question: string) {
		return (event: React.MouseEvent<HTMLButtonElement>) => {
			// handleSubmit(question);
			//todo
			appendQuestion({
				role: 'user',
				content: question,
			});
		};
	}

	//add files
	function toggleAdd() {
		setIsAddOpen(!isAddOpen);
	}
	function handleAddFileElDelete(index: number) {
		return (evt: React.MouseEvent<HTMLButtonElement>) => {
			const newFileList = [...addFiles];
			newFileList.splice(index, 1);
			setAddFiles(newFileList);
		};
	}
	function handleAddFileChange(evt: React.ChangeEvent<HTMLInputElement>) {
		if (evt.currentTarget.files?.length) {
			const files = Array.from(evt.currentTarget.files);
			console.log('files: ', files);
			//check total size
			//need to get original file size from server
			//maybe should do before the upload
			//check file type
			for (let i = 0; i < files.length; i++) {
				if (!checkFileExtension(files[i].name, ['pdf'])) {
					window.alert('You can only upload PDF files.');
					return;
				}
			}
			setAddFiles((pre) => {
				return [...pre, ...files];
			});
		}
	}
	function handleAddExistDocuChange(status: 'exist' | 'delete', idx: number) {
		setAddDiaExistFiles((pre) => {
			var temp = [...pre];
			temp[idx].status = status;
			return temp;
		});
	}
	async function handleAddSubmit() {
		if (isLoading) {
			return;
		}
		if (authStatus === 'unauthenticated') {
			window.alert('You need to login first.');
			router.push('/login');
			return;
		}

		setIsLoading(true);

		const deleteFiles = addDiaExistFiles
			.filter((existFile) => {
				return existFile.status === 'delete';
			})
			.map((existFile) => {
				return existFile.file;
			});
		console.log('delete IDs: ', deleteFiles);

		try {
			if (deleteFiles.length) {
				setAddDiaProgressMessage('Preparing');
				let receivedData = '';
				let lastProcessedIndex = 0;
				await axiosAPI({
					method: 'DELETE',
					url: '/conversation/file',
					data: {
						deleteFiles: deleteFiles,
						convStringId: router.query.convId,
					},
					onDownloadProgress: (progress) => {
						receivedData +=
							progress.event.currentTarget.responseText.slice(
								lastProcessedIndex,
							);
						lastProcessedIndex =
							progress.event.currentTarget.responseText.length;
						let rawDataArray = receivedData.split('#');
						let parsedMessage = '';
						let parsedProgress = 0;
						rawDataArray.forEach((rawData, index) => {
							console.log('raw data: ', rawData);
							if (index === rawDataArray.length - 1) {
								receivedData = rawData;
							} else {
								let parsedData = JSON.parse(rawData);
								console.log('parsed data: ', parsedData);
								parsedMessage = parsedData.message;
								parsedProgress = Number(parsedData.progress);
							}
						});
						setAddDiaProgress(parsedProgress);
						setAddDiaProgressMessage(parsedMessage);
					},
				});
			}
			if (addFiles.length) {
				setAddDiaProgressMessage('Preparing');
				const formData = new FormData();
				for (let i = 0; i < addFiles.length; i++) {
					formData.append(`file${i}`, addFiles[i]);
				}
				formData.append('convStringId', router.query.convId as string);
				let receivedData = '';
				let lastProcessedIndex = 0;

				await axiosAPI({
					method: 'POST',
					url: '/conversation/add/v2',
					data: formData,
					onDownloadProgress: (progress) => {
						receivedData +=
							progress.event.currentTarget.responseText.slice(
								lastProcessedIndex,
							);
						lastProcessedIndex =
							progress.event.currentTarget.responseText.length;
						let rawDataArray = receivedData.split('#');
						let parsedMessage = '';
						let parsedProgress = 0;
						rawDataArray.forEach((rawData, index) => {
							if (index === rawDataArray.length - 1) {
								receivedData = rawData;
							} else {
								let parsedData = JSON.parse(rawData);
								console.log('parsed data: ', parsedData);
								parsedMessage = parsedData.message;
								parsedProgress = Number(parsedData.progress);
							}
						});
						setAddDiaProgress(parsedProgress);
						setAddDiaProgressMessage(parsedMessage);
					},
				});
			}
			setIsLoading(false);
			// window.alert('Your changes have been saved.');
			setIsAlertOpen(true);
			setAlertContent('Your changes have been saved.');
			toggleLoadDocuments(true);
			setIsAddOpen(false);
			setAddFiles([]);
			// router.reload();
		} catch (error) {
			console.log('promise catch err: ', error);
			setIsLoading(false);
			window.alert('Error occured.');
			setIsAddOpen(false);
		}
		// console.log('promise arr: ', promiseArr);
		// if (promiseArr.length) {
		// 	Promise.allSettled(promiseArr)
		// 		.then((promiseAllRes) => {
		// 			console.log('promise all res: ', promiseAllRes);
		// 			setIsLoading(false);
		// 			window.alert('Your changes have been saved.');
		// 			router.reload();
		// 		})
		// 		.catch((err) => {
		// 			console.log('promise catch err: ', err);
		// 			setIsLoading(false);
		// 			window.alert('Error occured.');
		// 			setIsAddOpen(false);
		// 		});
		// } else {
		// 	setIsLoading(false);
		// 	setIsAddOpen(false);
		// }
	}
	return {
		authData,
		conversation,
		messages: [],
		// questions,
		handleSubmit: handleSubmit_V2,
		input,
		setInput,
		answer,
		handleQuestionClick,
		messageBoxRef,
		scrollToBottom,
		scrollToTop,
		isLoading,
		handleScroll,
		salutation,
		// isQuestionBtn,
		// isLoadingQuestion,
		handleGenerateQuestion: handleGenerateQuestion_V3,
		documents,
		docuForQuestion,
		handleChangeDocuSelect,
		handleOptionToggle,
		optionDialog,
		chatMode,
		handleChatMode,
		handleClickDebate,
		debate,
		debateMessages,
		isLoadingDebate,
		handleSubmitDebate,
		handleScrollDebate,
		debateMessageBoxRef,
		toggleReferContent,
		isReferOpen,
		addFiles,
		isAddOpen,
		toggleAdd,
		handleAddFileChange,
		handleAddFileElDelete,
		handleAddSubmit,
		addDiaExistFiles,
		handleAddExistDocuChange,
		addDiaProgress,
		addDiaProgressMessage,
		isAlertOpen,
		alertContent,
		onAlertClose,
	};
}
function generateJWT(user: Session | null, provider: TProvider) {
	if (user) {
		const token = jsonwebtoken.sign(
			{ user, provider },
			process.env.JWT_SECRET ?? 'qwe',
			{
				expiresIn: '10sec',
			},
		);
		return token;
	} else {
		return null;
	}
}
