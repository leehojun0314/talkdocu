import { useState } from "react";

export const useManageView = () => {
  const [open, setOpen] = useState(false);
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
  };
};
