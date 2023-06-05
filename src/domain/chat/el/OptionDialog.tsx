import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from '@mui/material';
type TOptionDialog = {
	isOpen: boolean;
	handleOptionClose: (event: React.MouseEvent<HTMLButtonElement>) => void;
};
export default function OptionDialog({
	isOpen,
	handleOptionClose,
}: TOptionDialog) {
	return (
		<Dialog open={isOpen} onClose={handleOptionClose}>
			<DialogTitle>Chat Options</DialogTitle>
			<DialogContent></DialogContent>
			<DialogActions>
				<Button>Cancel</Button>
				<Button>Confirm</Button>
			</DialogActions>
		</Dialog>
	);
}
