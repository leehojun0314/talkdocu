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
	ListSubheader,
	Typography,
} from '@mui/material';
import React, { useRef } from 'react';
import { css } from '@emotion/react';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import pdf from '@/assets/icons/pdf.png';
import Image from 'next/image';
import { Color } from '@/common/theme/colors';
import { red } from '@mui/material/colors';
import { TExistFile } from '@/types/types';
type AddDialogType = {
	open: boolean;
	files: File[];
	isLoading: boolean;
	documents: TExistFile[];
	progress: number;
	progressMsg: string;
	onClose: () => void;
	handleUpload: (evt: React.MouseEvent<HTMLButtonElement>) => void;
	handleFileChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
	handleFileElDelete: (
		idx: number,
	) => (evt: React.MouseEvent<HTMLButtonElement>) => void;
	handleAddExistDocuChange: (status: 'exist' | 'delete', idx: number) => void;
};
export const AddDialog = ({
	open,
	files,
	isLoading,
	documents,
	progress,
	progressMsg,
	onClose,
	handleUpload,
	handleFileChange,
	handleFileElDelete,
	handleAddExistDocuChange,
}: AddDialogType) => {
	const inputRef = useRef<HTMLInputElement>(null);
	return (
		<Dialog open={open} fullWidth={true} maxWidth={'md'}>
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
				<div css={sx.fileListContainer}>
					<div>
						<Typography css={sx.fileListHeader}>
							Additional Files
						</Typography>
						<List css={sx.addFileList} dense>
							{files?.length > 0 &&
								files.map((file, idx) => {
									return (
										<ListItem
											css={sx.fileListItem}
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
											{/* <ListItemAvatar>
												<Image
													src={pdf}
													alt='pdf'
													width={20}
													height={20}
												/>
											</ListItemAvatar> */}
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
					</div>
					<div>
						<Typography css={sx.fileListHeader}>
							Existing Files
						</Typography>
						<List css={sx.existFileList} dense>
							{documents.length > 0 &&
								documents.map((document, idx) => {
									return (
										<ListItem
											css={sx.fileListItem}
											key={idx}
											divider
											style={{
												backgroundColor:
													document.status === 'delete'
														? Color.BrandMain
														: Color.lightPurple,
											}}
											secondaryAction={
												<IconButton
													edge='end'
													aria-label='delete'
													size='small'
													onClick={() => {
														console.log('clicked');
														if (isLoading) {
															return;
														}
														if (document.status === 'exist') {
															handleAddExistDocuChange(
																'delete',
																idx,
															);
														} else if (
															document.status === 'delete'
														) {
															handleAddExistDocuChange(
																'exist',
																idx,
															);
														}
													}}
													disabled={isLoading}
												>
													{document.status === 'delete' && (
														<CheckIcon />
													)}
													{document.status === 'exist' && (
														<CloseIcon />
													)}
												</IconButton>
											}
										>
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
														textDecoration:
															document.status === 'delete'
																? 'line-through'
																: '',
													}}
												>
													{document.file.document_name}
												</Typography>
											</ListItemText>
										</ListItem>
									);
								})}
							{documents?.length === 0 && (
								<Typography css={sx.fileListComment}>
									No existing file
								</Typography>
							)}
						</List>
					</div>
				</div>
			</DialogContent>

			<DialogActions>
				{isLoading ? (
					<>
						<Typography
							style={{
								color: Color.BrandMain,
							}}
						>
							{progressMsg}
						</Typography>
						<CircularProgress
							variant={progress > 0 ? 'determinate' : 'indeterminate'}
							size={20}
							style={{
								color: Color.BrandMain,
								marginLeft: 10,
								marginRight: 10,
							}}
							value={progress}
						/>
					</>
				) : (
					<>
						<Button onClick={handleUpload} css={sx.uploadButton}>
							Confirm
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
	dialog: css`
		width: 700px;
	`,
	dialogTitle: css`
		font-weight: 500;
		color: ${Color.BrandMain};
		font-size: 20px;
		/* text-align: center; */
	`,
	fileListContainer: css`
		display: flex;
		/* grid-template-columns: 1fr 1fr; */
		/* gap: 20px; */
		flex-direction: row;
		justify-content: space-evenly;
		@media (max-width: 590px) {
			/* grid: none; */
			flex-direction: column;
		}
	`,
	existFileList: css`
		/* width: 270px; */
		max-width: 250px;
		min-height: 0px;
		max-height: 200px;
		background-color: ${Color.lightPurple};
		margin-bottom: 20px;
		border-radius: 15px;
		padding: 15px;
		overflow-y: scroll;
		@media (max-width: 590px) {
			width: 100%;
			max-width: 100%;
		}
	`,
	fileListHeader: css`
		font-size: medium;
		color: ${Color.BlackText};
		/* position: absolute; */
	`,
	addFileList: css`
		max-width: 250px;
		/* height: 200px; */
		min-height: 0px;
		max-height: 200px;
		background-color: ${Color.lightPurple};
		margin-bottom: 20px;
		border-radius: 15px;
		padding: 15px;
		overflow-y: scroll;
		@media (max-width: 590px) {
			width: 100%;
			max-width: 100%;
		}
	`,
	fileListItem: css`
		overflow-x: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
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
