import { Button, Dialog, Stack, TextField, Typography } from '@mui/material';
import Image from 'next/image';
import closeIcon from '@/assets/icons/close.png';
import { Color } from '@/common/theme/colors';
import { css } from '@emotion/react';
import check from '@/assets/icons/check.png';
import { useCustomMediaQuery } from '@/common/theme/screen';

export default function AlertDialog({
	open,
	onClose,
	content,
}: {
	open: boolean;
	onClose: () => void;
	content: string;
}) {
	const { isSmall } = useCustomMediaQuery();
	return (
		<Dialog open={open} fullWidth disableScrollLock={true}>
			<Stack p={isSmall ? '40px ' : '60px'}>
				<Stack my='40px' gap='6px'>
					<Typography
						color={Color.BlackText}
						variant='body1'
						textAlign={'center'}
					>
						{content}
					</Typography>
				</Stack>
				<Stack direction='row' gap='10px' justifyContent='center'>
					<Button css={sx.button} onClick={onClose}>
						Ok
					</Button>
				</Stack>
			</Stack>
		</Dialog>
	);
}
const sx = {
	button: css`
		color: #fff;
		background-color: ${Color.BrandMain};
		width: 128px;
		padding: 12px;
		font-size: 15px;
		border-radius: 10px;
		line-height: 26px;
		&:hover {
			background-color: ${Color.hoverBrandMain};
		}
	`,
};
