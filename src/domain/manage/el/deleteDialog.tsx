import {
	Button,
	CircularProgress,
	Dialog,
	Stack,
	Typography,
} from '@mui/material';
import Image from 'next/image';
import closeIcon from '@/assets/icons/close.png';
import check from '@/assets/icons/check.png';
import { Color } from '@/common/theme/colors';
import { useCustomMediaQuery } from '@/common/theme/screen';
import { Tconversation } from '@/domain/chat/hooks/useChatView';
type DeleteDialog = {
	open: boolean;
	onClose: () => void;
	selectedConv: Tconversation | undefined;
	handleDelete: () => void;
	isLoading: boolean | undefined;
};

export const DeleteDialog = ({
	open,
	onClose,
	selectedConv,
	handleDelete,
	isLoading,
}: DeleteDialog) => {
	const main = {
		// msg: `채팅방 ${selectedConv?.conversation_name}을(를) 정말 삭제하시겠습니까?\n삭제 이후에는 복구가 불가능합니다.`,
		msg: `Are you sure you want to delete ${selectedConv?.conversation_name}?`,
		msg2: 'Recovery is not possible after deletion',
	};
	const { isSmall } = useCustomMediaQuery();
	return (
		<Dialog open={open} fullWidth>
			<Stack p={isSmall ? '40px' : '60px'}>
				<Stack
					direction='row'
					justifyContent='space-between'
					alignItems='center'
				>
					<Typography variant={isSmall ? 'h5' : 'h2'}>
						{`Delete ${selectedConv?.conversation_name}`}
					</Typography>
					<Button onClick={onClose}>
						<Image
							src={closeIcon}
							alt='close'
							width={isSmall ? 24 : 48}
							height={isSmall ? 24 : 48}
						/>
					</Button>
				</Stack>
				<Typography variant='body2' color={Color.GrayText} my='40px'>
					{main.msg}
					<br />
					{main.msg2}
				</Typography>
				<Stack direction='row' gap='10px' justifyContent='flex-end'>
					{!isLoading ? (
						<Button onClick={handleDelete}>
							<Image src={check} alt='check' width={24} height={24} />
							<Typography variant='body2' color={Color.Navy}>
								{'Delete'}
							</Typography>
						</Button>
					) : (
						<Button disabled>
							<CircularProgress />
							<Typography variant='body2' color={Color.Navy}>
								{'Deleting...'}
							</Typography>
						</Button>
					)}
				</Stack>
			</Stack>
		</Dialog>
	);
};
