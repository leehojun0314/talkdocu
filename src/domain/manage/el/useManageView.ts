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
			loadConversation();
		} else {
			window.alert('You need to sign in first');
			router.push('/login');
		}
	}, []);
	useEffect(() => {
		if (scrollRef) {
			console.log('scroll ref: ', scrollRef);
			scrollRef.current?.scrollIntoView({
				behavior: 'smooth',
				block: 'end',
			});
		}
	}, [conversations]);
	function loadConversation(callback?: () => void) {
		axiosAPI({
			method: 'GET',
			url: '/conversation',
		})
			.then((response) => {
				setConversations(response.data);
				if (callback) {
					callback();
				}
			})
			.catch((err) => {
				console.log('use manage view effect err: ', err);
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
	};
};
