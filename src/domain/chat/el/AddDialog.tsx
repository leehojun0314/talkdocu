import { TrootState } from '@/redux/reducers';
import {
	Button,
	CircularProgress,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Typography,
} from '@mui/material';
import React, { useRef } from 'react';
import { css } from '@emotion/react';
import CloseIcon from '@mui/icons-material/Close';
import pdf from '@/assets/icons/pdf.png';
import Image from 'next/image';
import { Color } from '@/common/theme/colors';
type AddDialogType = {
	open: boolean;
	files: File[];
	isLoading: boolean;
	onClose: () => void;
	handleUpload: (evt: React.MouseEvent<HTMLButtonElement>) => void;
	handleFileChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
	handleFileElDelete: (
		idx: number,
	) => (evt: React.MouseEvent<HTMLButtonElement>) => void;
};
export const AddDialog = ({
	open,
	files,
	isLoading,
	onClose,
	handleUpload,
	handleFileChange,
	handleFileElDelete,
}: AddDialogType) => {
	const inputRef = useRef<HTMLInputElement>(null);

	return (
		<Dialog open={open}>
			<DialogTitle css={sx.dialogTitle}>Upload File</DialogTitle>
			<DialogContent>
				<Button
					css={sx.addButton}
					onClick={() => {
						if (inputRef) {
							inputRef.current?.click();
						}
					}}
					disabled={isLoading}
				>
					Select Files
				</Button>
				<input
					type='file'
					accept='.pdf'
					style={{
						display: 'none',
					}}
					multiple={true}
					ref={inputRef}
					onChange={handleFileChange}
				/>
				<List></List>
				<List css={sx.addFileList} dense>
					{files?.length > 0 &&
						files.map((file, idx) => {
							return (
								<ListItem
									key={idx}
									divider
									secondaryAction={
										<IconButton
											edge='end'
											aria-label='delete'
											size='small'
											onClick={handleFileElDelete(idx)}
											disabled={isLoading}
										>
											<CloseIcon />
										</IconButton>
									}
								>
									<ListItemAvatar>
										<Image
											src={pdf}
											alt='pdf'
											width={20}
											height={20}
										/>
									</ListItemAvatar>
									<ListItemText>
										<Typography
											style={{
												whiteSpace:
													'nowrap' /* 텍스트가 한 줄로 표시되도록 설정 */,
												overflow:
													'hidden' /* 넘치는 텍스트를 숨김 */,
												textOverflow:
													'ellipsis' /* 말줄임표(...)를 표시 */,
												fontSize: '12px',
											}}
										>
											{file.name}
										</Typography>
									</ListItemText>
								</ListItem>
							);
						})}
					{files?.length === 0 && (
						<Typography css={sx.fileListComment}>
							No selected file
						</Typography>
					)}
				</List>
			</DialogContent>

			<DialogActions>
				{isLoading ? (
					<CircularProgress
						size={20}
						style={{
							color: Color.BrandMain,
						}}
					/>
				) : (
					<>
						<Button onClick={handleUpload} css={sx.uploadButton}>
							Upload
						</Button>
						<Button
							style={{
								color: Color.BrandMain,
							}}
							onClick={() => {
								onClose();
							}}
						>
							Cancel
						</Button>
					</>
				)}
			</DialogActions>
		</Dialog>
	);
};

const sx = {
	dialogTitle: css`
		font-weight: 500;
		color: ${Color.BrandMain};
		font-size: 20px;
		/* text-align: center; */
	`,
	addFileList: css`
		min-width: 420px;
		/* height: 200px; */
		min-height: 0px;
		max-height: 200px;
		background-color: ${Color.lightPurple};
		margin-bottom: 20px;
		border-radius: 15px;
		padding: 15px;
		overflow: auto;
		/* display: flex; */
		/* justify-content: center; */
	`,
	addButton: css`
		width: 100%;
		color: ${Color.BrandMain};
		border: 1px solid ${Color.BrandMain};
		margin-bottom: 20px;
		&:hover {
			background-color: ${Color.hoverDark};
			color: ${Color.hoverBrandMain};
		}
	`,
	uploadButton: css`
		/* width: 200px; */
		color: ${Color.WhiteText};
		background-color: ${Color.BrandMain};
		&:hover {
			background-color: ${Color.hoverBrandMain};
		}
	`,
	fileListComment: css`
		color: ${Color.GrayText4};
		text-align: center;
		/* vertical-align: middle; */
	`,
};
