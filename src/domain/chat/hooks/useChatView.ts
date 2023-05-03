import useLoginCheck from '@/common/hooks/useLoginCheck';
import { TrootState } from '@/redux/reducers';
import { login } from '@/redux/reducers/actions';
import axiosAPI from '@/utils/axiosAPI';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
export type Tconversation = {
	id: number;
	conversation_name: string;
	end_time: number | null;
	created_at: string | null;
	fileUrl: string;
	salutation: string;
	user_id: number;
	status: 'created' | 'analyzing' | 'error';
	conversation_id: string;
};

export type Tquestion = {
	conversation_id: number;
	question_content: string;
	question_id: number;
	question_order: number;
};
export type Tmessage =
	| {
			conversation_id: number;
			create_time: number | null;
			message: string;
			message_id: number;
			message_order: number;
			sender: 'assistant' | 'user';
			user_id: number;
	  }
	| {
			message: string;
			message_id: number;
			sender: 'assistant' | 'user';
	  };
// function convertNewlinesToHTML(text: string) {
// 	return text.replace(/\n/g, '<br />');
// }
export default function useChatView() {
	const auth = useSelector((state: TrootState) => state);
	const dispatch = useDispatch();
	const [conversation, setConversation] = useState<Tconversation>();
	const [messages, setMessages] = useState<Tmessage[]>();
	const [questions, setQuestions] = useState<Tquestion[]>();
	const [isLoadingQuestion, setIsLoadingQuestion] = useState<boolean>(false);
	const [input, setInput] = useState<string>('');
	const [salutation, setSalutation] = useState<string>();
	const [answer, setAnswer] = useState<{
		isOpen: boolean;
		content: string;
	}>({
		isOpen: false,
		content: '',
	});
	const [isQuestionBtn, setQuestionBtn] = useState<boolean>(false);
	const messageBoxRef = useRef<HTMLDivElement>(null);
	const [isScroll, setIsScroll] = useState<boolean>(false);
	const [isBottom, setIsBottom] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const router = useRouter();
	//1. 로그인 체크
	//2. 라우터 체크
	//2.1 라우터에 conv 없으면 로그인 정보의 last_conv 참조
	//2.2 라우터에 conv 있으면 해당 conv 로드 후 로그인 정보 변경

	useEffect(() => {
		axiosAPI({
			method: 'GET',
			url: '/auth/checkLogin',
		}).then((authRes) => {
			// const userData = authRes.data.userData;
			console.log('userData: ', authRes.data);
			const isLoggedIn = authRes.data.isLoggedIn;
			if (isLoggedIn) {
				//라우터 체크
				dispatch(login(authRes.data));
				if (!router.isReady) {
					return;
				}
				if (router.query.convId) {
					//check conversation status
					axiosAPI({
						method: 'GET',
						url: `/conversation/check?convId=${router.query.convId}`,
					})
						.then((checkRes) => {
							if (checkRes.data.status === 'created') {
								if (checkRes.data.salutation) {
									axiosAPI({
										method: 'GET',
										url: `/message/v4?convId=${router.query.convId}`,
									})
										.then((messageRes) => {
											console.log('message res: ', messageRes);
											setConversation(messageRes.data.conversation);
											setSalutation(
												messageRes.data.conversation.salutation,
											);
											if (!messageRes.data.questions?.length) {
												setQuestionBtn(true);
											} else {
												setQuestions(messageRes.data.questions);
											}
											setMessages(messageRes.data.messages);
											setIsScroll(true);
										})
										.catch((error) => {
											console.log('fetch message error: ', error);
										});
								} else {
									setIsLoading(true);
									axiosAPI({
										method: 'GET',
										url: `/message/salutation?convStringId=${router.query.convId}`,
										onDownloadProgress: (progress) => {
											const text =
												progress.event.currentTarget.response;
											console.log('salutation text:', text);
											setSalutation(text);
										},
									})
										.then((salutationRes) => {
											console.log('salutation res:', salutationRes);
											if (!questions?.length) {
												setQuestionBtn(true);
											}
										})
										.catch((error) => {
											console.log('salutation error:', error);
										})
										.finally(() => {
											setIsLoading(false);
										});
								}
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

					// const convId = userData.last_conv;
					// if (convId) {
					// 	//check conversation
					// 	axiosAPI({
					// 		method: 'GET',
					// 		url: `/conversation/check?convId=${convId}`,
					// 	})
					// 		.then((checkRes) => {
					// 			console.log('checkRes: ', checkRes);
					// 			if (checkRes.data.status === 'created') {
					// 				return axiosAPI({
					// 					method: 'GET',
					// 					url: `/message/v3?convId=${convId}`,
					// 				});
					// 			} else {
					// 				return Promise.reject();
					// 			}
					// 		})
					// 		.then((messageRes) => {
					// 			dispatch(login(authRes.data));
					// 			setConversation(messageRes.data.conversation);
					// 			setQuestions(messageRes.data.questions);
					// 			setMessages(messageRes.data.messages);
					// 			setIsScroll(true);
					// 		})
					// 		.catch((err) => {
					// 			console.log('unexpected error: ', err);
					// 			router.push('/error');
					// 		});
					// } else {
					// 	//last conv가 없을 시 == 채팅방이 없을 시
					// 	window.alert(
					// 		'There is no chat room available. Please upload a file on the homepage and create a chat room.',
					// 	);
					// 	router.push('/');
					// }
				}
			} else {
				window.alert('You need to login first');
				router.push('/login');
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [router]);
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
	function handleGenerateQuestion(event: React.MouseEvent<HTMLButtonElement>) {
		setQuestionBtn(false);
		setIsLoadingQuestion(true);
		axiosAPI({
			method: 'GET',
			url: `/message/questions?convStringId=${router.query.convId}`,
		})
			.then((questionRes) => {
				console.log('questionRes:', questionRes);
				setQuestions(questionRes.data.questions);
			})
			.catch((err) => {
				console.log('get question error: ', err);
			})
			.finally(() => {
				setIsLoadingQuestion(false);
			});
	}
	function handleSubmit(input: string) {
		console.log('input : ', input);
		if (auth?.isLoggedIn) {
			//add my message
			if (messages) {
				setMessages((pre) => {
					if (pre) {
						return [
							...pre,
							{ message: input, message_id: pre.length, sender: 'user' },
						];
					}
				});
			} else {
				return [{ message: input, message_id: 0, sender: 'user' }];
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
			let pages: number[] = [];
			axiosAPI({
				method: 'POST',
				url: '/message/v5',
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
					const rawDataArray = receivedData.split('\n');
					let parsedText = '';
					rawDataArray.forEach((rawData, index) => {
						if (index === rawDataArray.length - 1) {
							receivedData = rawData;
						} else {
							const parsedData = JSON.parse(rawData);

							parsedText += parsedData.text;
							pages = parsedData.pages;
						}
					});

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
					const message =
						result +
						(pages.length > 0
							? `\n(ref : ${pages.join(', ')} page)`
							: '');
					// const resJson = JSON.parse(submitRes.data);
					setAnswer({ isOpen: false, content: '' });
					setMessages((pre) => {
						if (pre) {
							return [
								...pre,
								{
									message: message,
									message_id: pre.length,
									sender: 'assistant',
								},
							];
						} else {
							return [
								{
									message: message,
									message_id: 1,
									sender: 'assistant',
								},
							];
						}
					});
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
		}
	}
	// const [questions, setQuestions] = useState<
	function handleQuestionClick(question: Tquestion) {
		return (event: React.MouseEvent<HTMLButtonElement>) => {
			handleSubmit(question.question_content);
		};
	}

	return {
		auth,
		conversation,
		messages,
		questions,
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
		isQuestionBtn,
		isLoadingQuestion,
		handleGenerateQuestion,
	};
}
