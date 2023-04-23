import useLoginCheck from '@/common/hooks/useLoginCheck';
import { TrootState } from '@/redux/reducers';
import { login } from '@/redux/reducers/actions';
import axiosAPI from '@/utils/axiosAPI';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
export type Tconversation = {
	conversation_id: number;
	conversation_name: string;
	end_time: number | null;
	created_at: string | null;
	fileUrl: string;
	salutation: string;
	user_id: number;
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
export default function useChatView() {
	const auth = useSelector((state: TrootState) => state);
	const dispatch = useDispatch();
	const [conversation, setConversation] = useState<Tconversation>();
	const [messages, setMessages] = useState<Tmessage[]>();
	const [questions, setQuestions] = useState<Tquestion[]>();
	const [input, setInput] = useState<string>('');
	const [answer, setAnswer] = useState<{
		isOpen: boolean;
		content: string;
	}>({
		isOpen: false,
		content: '',
	});
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
		console.log('router : ', router.query);
		axiosAPI({
			method: 'GET',
			url: '/auth/checkLogin',
		}).then((authRes) => {
			console.log('auth res: ', authRes);
			const userData = authRes.data.userData;
			const isLoggedIn = authRes.data.isLoggedIn;
			if (isLoggedIn) {
				//라우터 체크
				if (router.query.convId) {
					axiosAPI({
						method: 'GET',
						url: `/message/v3?convId=${router.query.convId}`,
					})
						.then((messageRes) => {
							authRes.data.userData.last_conv = router.query.convId;
							dispatch(login(authRes.data));
							setConversation(messageRes.data.conversation);
							setQuestions(messageRes.data.questions);
							setMessages(messageRes.data.messages);
							setIsScroll(true);
							//need to update last convid
							return axiosAPI({
								method: 'PATCH',
								url: '/conversation/last',
								data: {
									convId: router.query.convId,
								},
							});
						})
						.then((patchRes) => {
							console.log('patchRes: ', patchRes);
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
					const convId = userData.last_conv;
					if (convId) {
						axiosAPI({
							method: 'GET',
							url: `/message/v3?convId=${convId}`,
						})
							.then((messageRes) => {
								dispatch(login(authRes.data));
								setConversation(messageRes.data.conversation);
								setQuestions(messageRes.data.questions);
								setMessages(messageRes.data.messages);
								setIsScroll(true);
							})
							.catch((err) => {
								console.log('unexpected error: ', err);
								router.push('/error');
							});
					} else {
						//last conv가 없을 시 == 채팅방이 없을 시
						window.alert(
							'채팅 방이 없습니다. 먼저 채팅방을 생성해주세요.',
						);
						router.push('/');
					}
				}
			} else {
				window.alert('로그인이 필요한 서비스 입니다.');
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
	}, [isScroll, scrollToBottom]);
	useEffect(() => {
		if (isBottom && isLoading) {
			scrollToBottom();
		}
	}, [isBottom, answer, isLoading, scrollToBottom]);

	function handleSubmit(input: string) {
		if (auth?.isLoggedIn) {
			//add my message
			if (messages) {
				setMessages((pre) => {
					if (pre) {
						return [
							...pre,
							{ message: input, message_id: pre.length, sender: 'user' },
						];
					} else {
						return [];
					}
				});
			}
			setAnswer({
				isOpen: true,
				content: '',
			});
			// setIsScroll(true);
			setIsLoading(true);
			axiosAPI({
				method: 'POST',
				url: '/message/v3',
				data: {
					text: input,
					conversationId: auth.userData?.last_conv,
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
					console.log('response: ', submitRes);
					setAnswer({ isOpen: false, content: '' });
					setMessages((pre) => {
						if (pre) {
							return [
								...pre,
								{
									message: submitRes.data,
									message_id: pre.length,
									sender: 'assistant',
								},
							];
						} else {
							return [];
						}
					});
				})
				.catch((err) => {
					console.log('message err: ', err);
					setAnswer({ isOpen: false, content: '' });
				})
				.finally(() => {
					setIsLoading(false);
				});
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
	};
}
