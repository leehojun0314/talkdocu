import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from '@mui/material';
type TOptionDialog = {
	isOpen: boolean;
	handleClose: (event: React.MouseEvent<HTMLButtonElement>) => void;
	content: string;
};
export default function ReferDialog({
	isOpen,
	handleClose,
	content,
}: TOptionDialog) {
	return (
		<Dialog open={isOpen} onClose={handleClose}>
			<DialogTitle>Refered Content</DialogTitle>
			<DialogContent>{content}</DialogContent>
			<DialogActions>
				<Button onClick={handleClose}>Confirm</Button>
			</DialogActions>
		</Dialog>
	);
}
