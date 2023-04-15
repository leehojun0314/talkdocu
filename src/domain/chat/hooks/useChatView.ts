import useLoginCheck from '@/common/hooks/useLoginCheck';
import { TrootState } from '@/redux/reducers';
import axiosAPI from '@/utils/axiosAPI';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { text } from 'stream/consumers';
export type Tconversation = {
	conversation_id: number;
	conversation_name: string;
	end_time: number | null;
	start_time: number | null;
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
	const auth = useSelector((state: TrootState) => state);
	useLoginCheck(
		(auth) => {
			axiosAPI({
				method: 'GET',
				url: `/message/v3?convId=${auth.userData?.last_conv}`,
			})
				.then((messageRes) => {
					setConversation(messageRes.data.conversation);
					setQuestions(messageRes.data.questions);
					setMessages(messageRes.data.messages);
				})
				.catch((err) => {
					console.log('get message err: ', err);
				});
		},
		() => {
			window.alert('로그인이 필요한 서비스입니다.');
			window.location.href = '/';
		},
	);
	useEffect(() => {
		scrollToBottom();
	}, [messages, answer]);
	function scrollToBottom() {
		if (messageBoxRef.current) {
			messageBoxRef.current.scrollIntoView({
				behavior: 'auto',
				block: 'end',
			});
		}
	}
	function scrollToTop() {
		if (messageBoxRef.current) {
			messageBoxRef.current.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
		}
	}

	function handleSubmit(input: string) {
		if (auth.isLoggedIn) {
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
	};
}
