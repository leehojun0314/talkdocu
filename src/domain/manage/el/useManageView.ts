import useAlert from '@/common/hooks/useAlert';
import { Tconversation } from '@/domain/chat/hooks/useChatView';
import axiosAPI from '@/utils/axiosAPI';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

export const useManageView = () => {
	const [open, setOpen] = useState(false);
	const [conversations, setConversations] = useState<Tconversation[]>([]);
	const [selectedConv, setSelectedConv] = useState<Tconversation>();
	const [isLoading, setIsLoading] = useState<boolean>();
	const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
	const [isScroll, setIsScroll] = useState<boolean>(false);
	const {
		open: isAlertOpen,
		toggleOpen: toggleOpenAlert,
		content: alertContent,
		onClose: onCloseAlert,
	} = useAlert();
	const router = useRouter();
	const scrollRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (localStorage.getItem('token')) {
			loadConversation(() => {
				setIsScroll(true);
			});
		} else {
			window.alert('You need to sign in first');
			router.push('/login');
		}
	}, []);
	useEffect(() => {
		if (scrollRef && isScroll) {
			scrollRef.current?.scrollIntoView({
				behavior: 'smooth',
				block: 'end',
			});
			setIsScroll(false);
		}
	}, [conversations, isScroll]);
	useEffect(() => {
		if (isAnalyzing) {
			setTimeout(() => {
				loadConversation();
			}, 10000);
		}
	}, [isAnalyzing, conversations]);
	function handleClickChat(conversation: Tconversation) {
		return () => {
			router.push(`/chat?convId=${conversation.conversation_id}`);
		};
	}
	function loadConversation(callback?: () => void) {
		axiosAPI({
			method: 'GET',
			url: '/conversation',
		})
			.then((response) => {
				console.log('get conversation res: ', response);
				const tempConversations: Tconversation[] = response.data;
				setConversations(tempConversations);
				if (callback) {
					callback();
				}
				//check analyze
				const analyzingConv = tempConversations.filter(
					(conv) => conv.status === 'analyzing',
				);
				if (analyzingConv.length > 0) {
					setIsAnalyzing(true);
				} else {
					setIsAnalyzing(false);
				}
			})
			.catch((err) => {
				console.log('use manage view effect err: ', err);
				// window.alert('error occured');
				router.push('/');
			});
	}
	const handleDetailOpen = (conversation: Tconversation) => {
		return () => {
			setOpen(true);
			setSelectedConv(conversation);
		};
	};
	const handleDetailClose = () => {
		setOpen(false);
		setSelectedConv(undefined);
	};
	const [editOpen, setEditOpen] = useState(false);
	const handleEditOpen = () => {
		setEditOpen(true);
		setOpen(false);
	};
	const handleEditClose = () => {
		setEditOpen(false);
		setOpen(true);
	};
	const handleEditChange = () => {
		loadConversation(() => {
			handleEditClose();
			handleDetailClose();
		});
	};
	const [deleteOpen, setDeleteOpen] = useState(false);
	const handleDeleteOpen = () => {
		setDeleteOpen(true);
		setOpen(false);
	};
	const handleDeleteClose = () => {
		setDeleteOpen(false);
		setOpen(true);
	};

	function handleDelete() {
		setIsLoading(true);
		axiosAPI({
			method: 'DELETE',
			url: `/conversation?convId=${selectedConv?.conversation_id}`,
		})
			.then((deleteRes) => {
				console.log('delete res: ', deleteRes);
				loadConversation(() => {
					toggleOpenAlert('삭제 되었습니다.', true, () => {
						handleDeleteClose();
						handleDetailClose();
						toggleOpenAlert('', false, () => {});
					});
				});
			})
			.catch((err) => {
				console.log('delete err : ', err);
			})
			.finally(() => {
				console.log('finally called: ');
				setIsLoading(false);
			});
	}

	return {
		open,
		handleDetailOpen,
		handleDetailClose,
		editOpen,
		handleEditOpen,
		handleEditClose,
		deleteOpen,
		handleDeleteOpen,
		handleDeleteClose,
		conversations,
		selectedConv,
		handleDelete,
		isLoading,
		setIsLoading,
		isAlertOpen,
		onCloseAlert,
		alertContent,
		handleEditChange,
		scrollRef,
		handleClickChat,
	};
};
