import useLoginCheck from '@/common/hooks/useLoginCheck';
import { ChatView } from '@/domain/chat/ChatView';
import { NextPage } from 'next';
import Head from 'next/head';

const ChatPage: NextPage = () => {
	return (
		<>
			<Head>
				<title>Chat</title>
			</Head>
			<ChatView />
		</>
	);
};

export default ChatPage;
