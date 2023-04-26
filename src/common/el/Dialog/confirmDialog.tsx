import { Color } from '@/common/theme/colors';
import { useCustomMediaQuery } from '@/common/theme/screen';
import { Button, Dialog, Stack, Typography } from '@mui/material';
import { css } from '@emotion/react';

export default function ConfirmDialog({
	open,
	onClose,
	onConfirm,
	content,
}: {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	content: string;
}) {
	const { isSmall } = useCustomMediaQuery();

	return (
		<Dialog open={open} fullWidth>
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
					<Button css={sx.cancel} onClick={onClose}>
						Cancel
					</Button>
					<Button css={sx.confirm} onClick={onConfirm}>
						Ok
					</Button>
				</Stack>
			</Stack>
		</Dialog>
	);
}
const sx = {
	cancel: css`
		color: ${Color.BrandMain};
		background-color: ${Color.lightPurple};
		width: 128px;
		padding: 12px;
		font-size: 15px;
		border-radius: 10px;
		line-height: 26px;
		&:hover {
			background-color: ${Color.hoverBrandMain};
		}
	`,
	confirm: css`
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
