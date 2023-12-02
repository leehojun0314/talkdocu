import { Button, Dialog, Stack, TextField, Typography } from '@mui/material';
import Image from 'next/image';
import closeIcon from '@/assets/icons/close.png';
import { Color } from '@/common/theme/colors';
import { css } from '@emotion/react';
import check from '@/assets/icons/check.png';
import { useCustomMediaQuery } from '@/common/theme/screen';
import { useState } from 'react';
import axiosAPI from '@/utils/axiosAPI';
import { TConversation } from '@/types/types';
type EditDialogType = {
	open: boolean;
	onClose: () => void;
	handleEditChange: () => void;
	conversation: TConversation | undefined;
};
function useEditDialog(
	conversation: TConversation | undefined,
	loadConversation: (callback?: () => void) => void,
	onClose: () => void,
) {
	const [input, setInput] = useState<string>();
	const [isLoading, setIsLoading] = useState<boolean>();

	function handleSubmit() {
		if (input?.length) {
			axiosAPI({
				method: 'PATCH',
				url: '/conversation/name',
				data: {
					convId: conversation?.conversation_id,
					newName: input,
				},
			})
				.then((patchNameRes) => {
					loadConversation(() => {
						onClose();
					});
				})
				.catch((err) => {
					console.log('patch name err : ', err);
				});
		} else {
			window.alert('The name must be more than one character');
		}
	}
	return { input, setInput, isLoading, setIsLoading, handleSubmit };
}
export const EditDialog = ({
	open,
	onClose,
	conversation,
	handleEditChange,
}: EditDialogType) => {
	const { isSmall } = useCustomMediaQuery();
	const { input, setInput, handleSubmit } = useEditDialog(
		conversation,
		handleEditChange,
		onClose,
	);
	return (
		<Dialog open={open} fullWidth>
			<Stack p={isSmall ? '40px ' : '60px'}>
				<Stack
					direction='row'
					justifyContent='space-between'
					alignItems='center'
				>
					<Typography variant={isSmall ? 'h5' : 'h2'}>
						{'Edit chat name'}
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
				<Stack my='40px' css={sx.fileName} gap='6px'>
					<Typography color={Color.GrayText} variant='body2'>
						{'New chat name'}
					</Typography>

					<TextField
						variant='standard'
						placeholder={conversation?.conversation_name}
						InputProps={{
							disableUnderline: true,
						}}
						value={input}
						onChange={(event) => {
							setInput(event.target.value);
						}}
					/>
				</Stack>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						gap: '10px',
						justifyContent: 'flex-end',
					}}
				>
					<Button onClick={handleSubmit}>
						<Image src={check} alt='check' width={24} height={24} />
						<Typography variant='body2' color={Color.Navy}>
							Edit
						</Typography>
					</Button>
				</div>
			</Stack>
		</Dialog>
	);
};

const sx = {
	fileName: css`
		border-bottom: solid 1px ${Color.LightGrayText};
	`,
};
