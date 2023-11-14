import { TrootState } from '@/redux/reducers';
import { login } from '@/redux/reducers/actions';
import {
	TChatMode,
	TConversation,
	TDebate,
	TDebateMessage,
	TDocument,
	TExistFile,
	TMessage,
	TOptionDialog,
	TReferenceDoc,
} from '@/types';
import axiosAPI from '@/utils/axiosAPI';
import checkFileExtension from '@/utils/checkFileType';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
// export type Tconversation = {
// 	id: number;
// 	conversation_name: string;
// 	end_time: number | null;
// 	created_at: string | null;
// 	fileUrl: string;
// 	salutation: string;
// 	user_id: number;
// 	status: 'created' | 'analyzing' | 'error';
// 	conversation_id: string;
// };

// export type Tquestion = {
// 	conversation_id: number;
// 	question_content: string;
// 	question_id: number;
// 	question_order: number;
// };
// export type Tmessage =
// 	| {
// 			conversation_id: number;
// 			create_time: number | null;
// 			message: string;
// 			message_id: number;
// 			message_order: number;
// 			sender: 'assistant' | 'user';
// 			user_id: number;
// 			is_question: 0 | 1;
// 			question_doc_name: string | null;
// 	  }
// 	| {
// 			message: string;
// 			message_id: number;
// 			sender: 'assistant' | 'user';
// 			is_question: 0 | 1;
// 			question_doc_name: string | null;
// 	  };
// // function convertNewlinesToHTML(text: string) {
// // 	return text.replace(/\n/g, '<br />');
// // }
// export type Tdocument = {
// 	conversation_id: number;
// 	document_id: number;
// 	document_name: string;
// 	document_size: string;
// 	document_url: string;
// };

// export type TreferenceDoc = {
// 	page: number;
// 	documentName: string;
// };
// type ToptionDialog = {
// 	isOpen: boolean;
// };
// export type TchatMode = 'QA' | 'Debate';
// export type Tdebate = {
// 	debate_id: number;
// 	question_id: number;
// 	answer_id: number;
// 	refer_content: string;
// 	question_content: string;
// 	answer_content: string;
// };
// export type TdebateMessage = {
// 	id: number;
// 	content: string;
// 	sender: 'assistant' | 'user';
// 	time: number | null | undefined;
// 	debate_id: number;
// 	conversation_id: number | string | undefined;
// 	user_id: number | undefined;
// };
// export type TexistFile = {
// 	file: Tdocument;
// 	status: 'exist' | 'delete';
// };
// function referenceDocsToString(docs: TreferenceDoc[]): string {
// 	let result: string = 'Refered : ';

// 	// group by documentName
// 	const grouped = docs.reduce((groupedDocs, doc) => {
// 		if (!groupedDocs[doc.documentName]) {
// 			groupedDocs[doc.documentName] = [];
// 		}
// 		groupedDocs[doc.documentName].push(doc.page);
// 		return groupedDocs;
// 	}, {} as { [key: string]: number[] });

// 	// convert to string
// 	for (const [docName, pages] of Object.entries(grouped)) {
// 		const sortedPages = pages.sort((a, b) => a - b);
// 		result += `\n ${docName} (${sortedPages.join(', ')} page)`;
// 	}

// 	return result;
// }

export default function useChatViewV2() {
	const auth = useSelector((state: TrootState) => state);
	const dispatch = useDispatch();
	const [conversation, setConversation] = useState<TConversation>();
	const [messages, setMessages] = useState<TMessage[]>([]);
	// const [questions, setQuestions] = useState<Tquestion[]>();
	// const [isLoadingQuestion, setIsLoadingQuestion] = useState<boolean>(false);
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
	useEffect(() => {
		setIsLoading(true);
		if (!router.isReady) {
			return;
		}
		axiosAPI({
			method: 'GET',
			url: '/auth/checkLogin',
		})
			.then((authRes) => {
				// const userData = authRes.data.userData;
				const isLoggedIn = authRes.data.isLoggedIn;
				if (isLoggedIn) {
					//라우터 체크
					dispatch(login(authRes.data));

					if (router.query.convId) {
						//check conversation status
						axiosAPI({
							method: 'GET',
							url: `/conversation/check/v2?convId=${router.query.convId}`,
						})
							.then((checkRes) => {
								const checkConv: TConversation =
									checkRes.data.selectedConv;
								const documents: TDocument[] = checkRes.data.documents;
								if (checkConv.status === 'created') {
									axiosAPI({
										method: 'GET',
										url: `/message/v4?convId=${router.query.convId}`,
									})
										.then((messageRes) => {
											setConversation(messageRes.data.conversation);
											setSalutation(
												messageRes.data.conversation.salutation,
											);
											// setQuestionBtn(true);
											// setQuestions(messageRes.data.questions);
											setMessages(messageRes.data.messages);
											setDocuments(documents);
											if (documents.length) {
												setDocuForQuestion(
													documents[0].document_id,
												);
											}
											setIsScroll(true);
											setIsLoading(false);
											setAddDiaExistFiles(
												documents.map((el) => {
													return { file: el, status: 'exist' };
												}),
											);
										})
										.catch((error) => {
											console.log('fetch message error: ', error);
										});
								} else {
									window.alert('invalid conversation');
									return Promise.reject('invalid conversation');
								}
							})

							.catch((err) => {
								//invalid given conv id
								console.log('get message err: ', err);
								window.alert('invalid conversation id');
								router.push('/error');
							});
					}
					//라우터에 없을 시
					else {
						window.alert('Bad request');
						router.push('/');
					}
				} else {
					window.alert('You need to login first');
					router.push('/login');
				}
			})
			.catch((err) => {
				console.log('login check err: ', err);
				window.alert('You need to login first.');
				router.push('/login');
			});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router]);
	useEffect(() => {
		if (loadDocuments) {
			setIsLoading(true);
			axiosAPI({
				method: 'GET',
				url: `/conversation/check/v2?convId=${router.query.convId}`,
			})
				.then((checkRes) => {
					const documents: TDocument[] = checkRes.data.documents;
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
				.catch((err) => {
					console.log('load documents error: ', err);
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
			axiosAPI({
				method: 'GET',
				url: `/debate/message?answerId=${messageId}`,
			})
				.then((response) => {
					console.log('response: ', response);
					setChatMode('Debate');
					setDebate(response.data.debate as TDebate);
					setDebateMessages(response.data.messages as TDebateMessage[]);
				})
				.catch((err) => {
					console.log('err: ', err);
					window.alert(
						'Unavailable Conversation. \nPlease try again in another conversation.',
					);
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
	function handleGenerateQuestionV2(
		event: React.MouseEvent<HTMLButtonElement>,
	) {
		event.preventDefault();
		event.stopPropagation();
		if (isLoading) {
			return;
		}
		// setQuestionBtn(false);
		// setIsLoadingQuestion(true);
		setAnswer({
			isOpen: true,
			content: '',
		});
		setIsScroll(true);
		setIsLoading(true);
		let receivedData = '';
		let lastProcessedIndex = 0;
		let result = '';
		let questionDocName = '';
		axiosAPI({
			method: 'POST',
			url: `/message/questions/v3?convStringId=${router.query.convId}&docuId=${docuForQuestion}`,
			onDownloadProgress: (progress) => {
				receivedData +=
					progress.event.currentTarget.responseText.slice(
						lastProcessedIndex,
					);
				lastProcessedIndex =
					progress.event.currentTarget.responseText.length;
				const rawDataArray = receivedData.split('#');
				let parsedText = '';
				rawDataArray.forEach((rawData, index) => {
					if (index === rawDataArray.length - 1) {
						receivedData = rawData;
					} else {
						const parsedData = JSON.parse(rawData);
						parsedText += parsedData.text;
						questionDocName = parsedData.documentName;
					}
				});
				setAnswer((pre) => {
					return {
						isOpen: true,
						content: pre.content + parsedText,
					};
				});
				result += parsedText;
			},
		})
			.then((questionRes) => {
				setAnswer({ isOpen: false, content: '' });

				// setQuestions(questionRes.data.questions);
				// const questionsStr = questionRes.data.questions;
				// const documentForQuestion = questionRes.data.documentName;
				setMessages((pre) => {
					return [
						...pre,
						{
							message: result,
							message_id: pre.length,
							sender: 'assistant',
							is_question: 1,
							question_doc_name: questionDocName,
						},
					];
				});
			})
			.catch((err) => {
				console.log('get question error: ', err);
				if (err.response?.status === 401) {
					router.reload();
				}
				setAnswer({ isOpen: true, content: err.message });
			})
			.finally(() => {
				setIsLoading(false);
				// setIsLoadingQuestion(false);
			});
	}

	function handleSubmit(input: string) {
		if (!input.length) {
			return;
		}
		if (auth?.isLoggedIn) {
			//add my message
			if (messages) {
				setMessages((pre) => {
					if (pre) {
						return [
							...pre,
							{
								message: input,
								message_id: pre.length,
								sender: 'user',
								is_question: 0,
								question_doc_name: null,
							},
						];
					} else {
						return pre;
					}
				});
			} else {
				setMessages([
					{
						message: input,
						message_id: 0,
						sender: 'user',
						is_question: 0,
						question_doc_name: null,
					},
				]);
			}
			setAnswer({
				isOpen: true,
				content: '',
			});
			setIsScroll(true);
			setIsLoading(true);
			let receivedData = '';
			let lastProcessedIndex = 0;
			let result = '';
			let referenceDocs: TReferenceDoc[] = [];
			axiosAPI({
				method: 'POST',
				url: '/message/v6',
				data: {
					text: input,
					conversationId: router.query.convId,
				},
				onDownloadProgress: (progress) => {
					receivedData +=
						progress.event.currentTarget.responseText.slice(
							lastProcessedIndex,
						);
					lastProcessedIndex =
						progress.event.currentTarget.responseText.length;
					const rawDataArray = receivedData.split('#');
					let parsedText = '';
					rawDataArray.forEach((rawData, index) => {
						if (index === rawDataArray.length - 1) {
							receivedData = rawData;
						} else {
							const parsedData = JSON.parse(rawData);
							// console.log('parsed data: ', parsedData);
							parsedText += parsedData.text;
							referenceDocs = parsedData.referenceDocs;
						}
					});
					// console.log('parsed text: ', parsedText);
					setAnswer((pre) => {
						return {
							isOpen: true,
							content: pre.content + parsedText,
						};
					});

					// const text = progress.event.currentTarget.response;
					// setAnswer({
					// 	isOpen: true,
					// 	content: text,
					// });
					result += parsedText;
				},
			})
				.then((submitRes) => {
					console.log('submit res: ', submitRes);
					return axiosAPI({
						method: 'GET',
						url: `/message/v4?convId=${router.query.convId}`,
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
					setMessages(getMessageRes.data.messages);
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
			console.log('auth : ', auth);
			router.push('/login');
		}
	}
	function handleSubmitDebate(input: string) {
		if (auth?.isLoggedIn) {
			//add my message
			setDebateMessages((pre) => {
				const newEl: TDebateMessage = {
					id: 0,
					content: input,
					sender: 'user',
					debate_id: debate.debate_id,
					conversation_id: conversation?.conversation_id,
					user_id: auth.userData?.user_id,
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
			console.log('auth : ', auth);
			router.push('/login');
		}
	}
	// const [questions, setQuestions] = useState<
	function handleQuestionClick(question: string) {
		return (event: React.MouseEvent<HTMLButtonElement>) => {
			handleSubmit(question);
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
		if (!auth.isLoggedIn) {
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
		auth,
		conversation,
		messages,
		// questions,
		handleSubmit,
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
		handleGenerateQuestion: handleGenerateQuestionV2,
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
