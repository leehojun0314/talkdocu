import useLoginCheck from '@/common/hooks/useLoginCheck';
import { ChatView } from '@/domain/chat/ChatView';
import { NextPage } from 'next';

const ChatPage: NextPage = () => {
	useLoginCheck(undefined, () => {
		window.alert('로그인이 필요한 서비스입니다.');
		window.location.href = '/';
	});
	return <ChatView />;
};

export default ChatPage;
