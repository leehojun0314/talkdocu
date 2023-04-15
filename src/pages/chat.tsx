import useLoginCheck from '@/common/hooks/useLoginCheck';
import { ChatView } from '@/domain/chat/ChatView';
import { NextPage } from 'next';

const ChatPage: NextPage = () => {
	return <ChatView />;
};

export default ChatPage;
