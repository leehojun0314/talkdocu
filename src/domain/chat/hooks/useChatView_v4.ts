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
} from '@/types/types';
import checkFileExtension from '@/utils/checkFileType';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useChat, useCompletion } from 'ai/react';
export default function useChatViewV4() {
	const { status: authStatus, data: authData } = useSession();
	// const newAuthData: TExtendedAuthData | null = authData;
	const [conversation, setConversation] = useState<TConversation>();
	const [messages, setMessages] = useState<TMessage[]>([]);
	const [onFinishCalled, setOnFinishCalled] = useState<boolean>(false);
	const {
		completion: questionCompletion,
		setCompletion: setQuestionCompletion,
		complete,
	} = useCompletion({
		api: '/api/ai/questions_v2',
		onError(res) {
			console.log('on error: ', res);
			setIsLoading(false);
		},
		onFinish(message) {
			console.log('on finish: ', message);
			console.log('completion in on finish: ', questionCompletion);
			setOnFinishCalled(true);
			// setIsLoading(false);
			// setIsAnswerOpen(false);
			// setQuestionCompletion('');
		},
		onResponse(response) {
			console.log('on response: ', response);
		},
	});
	// console.log('question messages: ', questionMessages);
	console.log('completion : ', questionCompletion);

	// const [questions, setQuestions] = useState<TQuestion[]>();
	// const [isLoadingQuestion, setIsLoadingQuestion] = useState<boolean>(false);
	const [documents, setDocuments] = useState<TDocument[]>([]);
	const [docuForQuestion, setDocuForQuestion] = useState<number>();
	const [input, setInput] = useState<string>('');
	const [salutation, setSalutation] = useState<string>();
	const [isAnswerOpen, setIsAnswerOpen] = useState<boolean>(false);
	// const [answerContent, setAnswerContent] = useState<string>('')
	let answerContent = '';
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
	const router = useRouter();
	const [loadDocuments, toggleLoadDocuments] = useState<boolean>(false);
	if (questionCompletion) {
		answerContent = questionCompletion;
	}
	useEffect(() => {
		if (onFinishCalled) {
			console.log('answer content: ', answerContent);
			//send completion to api
			axios
				.post('/api/message/insertQuestion', {
					questionContent: answerContent,
					convStringId: router.query.convId,
					docuId: docuForQuestion,
				})
				.then((response) => {
					console.log('response: ', response.data);
					setMessages(response.data.messages);
				})
				.catch((err) => {
					console.log('err : ', err);
				})
				.finally(() => {
					setIsLoading(false);
					setQuestionCompletion('');
					setIsAnswerOpen(false);
				});
		}
	}, [onFinishCalled, docuForQuestion]);
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
		}
		// else if (authStatus === 'loading') {
		// 	setIsLoading(true);
		// }
		else if (authStatus === 'authenticated') {
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
					const tempDocuments: TDocument[] = response.data.documents;
					setDocuments(tempDocuments);
					if (tempDocuments.length > 0) {
						console.log(
							'documents length is more than 0',
							tempDocuments[0],
						);
						setDocuForQuestion(tempDocuments[0].document_id);
						setAddDiaExistFiles(
							tempDocuments.map((el) => {
								return { file: el, status: 'exist' };
							}),
						);
					}
					setIsScroll(true);
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
		if (loadDocuments) {
			setIsLoading(true);
			axios
				.get(`/api/conversation/getOne?convStringId=${router.query.convId}`)
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
		setTimeout(() => {
			if (messageBoxRef.current) {
				messageBoxRef.current.scrollTop =
					messageBoxRef.current.scrollHeight;
			}
		}, 0);
	}, [messageBoxRef, isBottom]);
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
		console.log('isbottom && isloading useEffect called');
		if (isBottom && isLoading) {
			scrollToBottom();
		}
	}, [isBottom, answerContent, isLoading, scrollToBottom]);

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
	}, [isBottomDebate, isLoading, scrollToBottomDebate]);

	const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
		let isBottom;
		if (messageBoxRef.current) {
			const target = messageBoxRef.current;
			const scrollTop = Math.round(target.scrollTop);
			const clientHeight = target.clientHeight;
			const scrollHeight = target.scrollHeight;
			isBottom = scrollTop + clientHeight >= scrollHeight;
		} else {
			isBottom = false;
		}
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
		evt.preventDefault();
		evt.stopPropagation();
		if (isLoading) {
			return;
		}
		setIsAnswerOpen(true);
		setIsLoading(true);
		setIsScroll(true);
		// appendQuestion(
		// 	{
		// 		id: '0',
		// 		content: '0',
		// 		role: 'user',
		// 	},
		// 	{
		// 		options: {
		// 			body: {
		// 				convStringId: router.query.convId,
		// 				docuId: docuForQuestion,
		// 			},
		// 		},
		// 	},
		// );
		complete('0', {
			body: {
				convStringId: router.query.convId,
				docuId: docuForQuestion,
			},
		});
	}
	function handleSubmit(input: string) {}

	function handleSubmitDebate(input: string) {
		if (authStatus === 'authenticated') {
			//add my message
		} else {
			console.log('you are not logged in');
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
				await axios({
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

				await axios({
					method: 'POST',
					url: '/api/conversation/addFile',
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
		messages,
		// questions,
		handleSubmit,
		input,
		setInput,
		isAnswerOpen,
		answerContent,
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
