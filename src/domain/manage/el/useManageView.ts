import useAlert from '@/common/hooks/useAlert';
import useLoginCheck from '@/common/hooks/useLoginCheck';
import { Tconversation } from '@/domain/chat/hooks/useChatView';
import axiosAPI from '@/utils/axiosAPI';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

export const useManageView = () => {
	const router = useRouter();

	useLoginCheck(
		(data) => {
			if (data.isLoggedIn) {
				setIsLoadingConv(true);
				loadConversation(() => {
					setIsLoadingConv(false);
					setIsScroll(true);
				});
			} else {
				window.alert('You need to sign in first');
				router.push('/login');
			}
		},
		() => {
			window.alert('You need to sign in first');
			router.push('/login');
		},
	);
	const [open, setOpen] = useState(false);
	const [conversations, setConversations] = useState<Tconversation[]>([]);
	const [selectedConv, setSelectedConv] = useState<Tconversation>();
	const [isLoading, setIsLoading] = useState<boolean>();
	const [isLoadingConv, setIsLoadingConv] = useState<boolean>(true);
	const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
	const [isScroll, setIsScroll] = useState<boolean>(false);
	const {
		open: isAlertOpen,
		toggleOpen: toggleOpenAlert,
		content: alertContent,
		onClose: onCloseAlert,
	} = useAlert();
	const scrollRef = useRef<HTMLDivElement>(null);
	// useEffect(() => {
	// 	if (localStorage.getItem('token')) {
	// 		loadConversation(() => {
	// 			setIsScroll(true);
	// 		});
	// 	} else {
	// 		window.alert('You need to sign in first');
	// 		router.push('/login');
	// 	}
	// }, []);
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
				const tempConversations: Tconversation[] = response.data;
				setConversations(tempConversations);

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
				// window.alert('error occured');
				router.push('/');
			})
			.finally(() => {
				// setIsLoadingConv(false);
				if (callback) {
					callback();
				}
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
				loadConversation(() => {
					handleDeleteClose();
					handleDetailClose();
					toggleOpenAlert(
						'The conversation has been deleted.',
						true,
						() => {
							setIsLoading(false);
							toggleOpenAlert('', false, () => {});
						},
					);
				});
			})
			.catch((err) => {
				console.log('delete err : ', err);
			})
			.finally(() => {});
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
		isLoadingConv,
	};
};
