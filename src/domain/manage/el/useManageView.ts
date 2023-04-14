import axiosAPI from '@/utils/axiosAPI';
import { useEffect, useState } from 'react';

export const useManageView = () => {
	const [open, setOpen] = useState(false);
	const [conversations, setConversations] = useState<
		{
			conversation_id: number;
			conversation_name: string;
			end_time: number | null;
			fileUrl: string | null;
			salutation: string | null;
			start_time: number | null;
			user_id: number;
		}[]
	>([]);
	useEffect(() => {
		axiosAPI({
			method: 'GET',
			url: '/conversation',
		}).then((response) => {
			console.log('conversations response: ', response.data);
			setConversations(response.data);
		});
	}, []);
	const handleClickOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
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
		handleClickOpen,
		handleClose,
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
	};
};
