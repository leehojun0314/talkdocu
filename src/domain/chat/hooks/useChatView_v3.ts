import {
	TChatMode,
	TConversation,
	TDebate,
	TDebateMessage,
	TDocument,
	TExistFile,
	TMessage,
	TOptionDialog,
} from '@/types';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

export default function useChatViewV3() {
	const { status, data } = useSession();
	const router = useRouter();
	const [conversation, setConversation] = useState<TConversation>();
	const [messages, setMessages] = useState<TMessage[]>([]);
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
	useEffect(() => {
		if (status === 'authenticated') {
			if (router.query.convId) {
				axios.get(`/api/message/getMessages`);
			}
		}
	}, [status, router]);
}
