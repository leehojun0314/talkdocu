import { Tconversation } from '@/domain/chat/hooks/useChatView';
import axiosAPI from '@/utils/axiosAPI';
import { useEffect, useState } from 'react';

export const useManageView = () => {
	const [open, setOpen] = useState(false);
	const [conversations, setConversations] = useState<Tconversation[]>([]);
	const [selectedConv, setSelectedConv] = useState<Tconversation>();
	useEffect(() => {
		axiosAPI({
			method: 'GET',
			url: '/conversation',
		}).then((response) => {
			console.log('conversations response: ', response.data);
			setConversations(response.data);
		});
	}, []);
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
	const [deleteOpen, setDeleteOpen] = useState(false);
	const handleDeleteOpen = () => {
		setDeleteOpen(true);
		setOpen(false);
	};
	const handleDeleteClose = () => {
		setDeleteOpen(false);
		setOpen(true);
	};
	const [confirmOpen, setConfirmOpen] = useState(false);
	function handleConfirmClose() {
		setConfirmOpen(false);
		setOpen(true);
	}
	function handleConfirmOpen() {
		setConfirmOpen(true);
		setOpen(false);
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
		handleConfirmClose,
		handleConfirmOpen,
		confirmOpen,
		selectedConv,
	};
};
