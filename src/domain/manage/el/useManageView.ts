import useAlert from '@/common/hooks/useAlert';
import useLoginCheck from '@/common/hooks/useLoginCheck';
import { TConversation } from '@/types/types';
import axiosAPI from '@/utils/axiosAPI';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';

export const useManageView = () => {
	const router = useRouter();
	const { data, status } = useSession();
	// useLoginCheck(
	// 	(data) => {
	// 		if (data.isLoggedIn) {
	// 			setIsLoadingConv(true);
	// 			loadConversation(() => {
	// 				setIsLoadingConv(false);
	// 				setIsScroll(true);
	// 			});
	// 		} else {
	// 			window.alert('You need to sign in first');
	// 			router.push('/login');
	// 		}
	// 	},
	// 	() => {
	// 		window.alert('You need to sign in first');
	// 		router.push('/login');
	// 	},
	// );
	const [open, setOpen] = useState(false);
	const [conversations, setConversations] = useState<TConversation[]>([]);
	const [selectedConv, setSelectedConv] = useState<TConversation>();
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
		if (status === 'authenticated') {
			loadConversation(() => {
				setIsScroll(true);
			});
		}
		if (status === 'unauthenticated') {
			window.alert('You need to sign in first.');
			window.sessionStorage.setItem('redirect', window.location.href);
			router.push('/login');
		}
	}, [status, router]);
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
	function handleClickChat(conversation: TConversation) {
		return () => {
			router.push(`/chat?convId=${conversation.conversation_id}`);
		};
	}
	async function loadConversation(callback?: () => void) {
		return new Promise((resolve, reject) => {
			axios
				.get('/api/conversation/getMany')
				.then((response) => {
					const tempConversations: TConversation[] =
						response.data.conversations;
					setConversations(tempConversations);
					//check analyze
					const analyzingConv = tempConversations.filter((conv) => {
						return conv.status === 'analyzing';
					});
					if (analyzingConv.length > 0) {
						setIsAnalyzing(true);
					} else {
						setIsAnalyzing(false);
					}
					resolve(true);
				})
				.catch((err) => {
					console.log('err:', err);
					reject(false);
				})
				.finally(() => {
					if (callback) {
						callback();
					}
					setIsLoadingConv(false);
				});
		});
	}
	const handleDetailOpen = (conversation: TConversation) => {
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
		axios
			.delete(`/api/conversation/delete`, {
				data: {
					convStringId: selectedConv?.conversation_id,
				},
			})
			.then((response) => {
				console.log('delete response: ', response);
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
				console.log('delete err: ', err);
				toggleOpenAlert(err.message, true, () => {
					setIsLoading(false);
					toggleOpenAlert('', false, () => {});
				});
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
		isLoadingConv,
	};
};
