import { Pcheader } from '@/common/el/Header/PCheader';
import { Color } from '@/common/theme/colors';
import { css } from '@emotion/react';
import {
	Button,
	CircularProgress,
	IconButton,
	Input,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Stack,
	Typography,
} from '@mui/material';
import file from '@/assets/icons/file.png';
import pdf from '@/assets/icons/pdf.png';
import Image from 'next/image';
import { Mq } from '@/common/theme/screen';
import useDragnDrop from '../hooks/useDragnDrop';
import AlertDialog from '@/common/el/Dialog/alertDialog';
import CloseIcon from '@mui/icons-material/Close';
const SelectedFileEl = ({
	file,
	index,
	handleFileElDelete,
}: {
	file: File;
	index: number;
	handleFileElDelete: (
		index: number,
	) => (evt: React.MouseEvent<HTMLButtonElement>) => void;
}) => {
	return (
		<ListItem
			divider
			secondaryAction={
				<IconButton
					edge='end'
					aria-label='delete'
					size='small'
					onClick={handleFileElDelete(index)}
				>
					<CloseIcon />
				</IconButton>
			}
			style={{
				paddingLeft: '10px',
			}}
		>
			<ListItemAvatar
				style={{
					minWidth: '25px',
					display: 'flex',
					justifyContent: 'flex-start',
					alignItems: 'center',
				}}
			>
				<Image src={pdf} alt='pdf' width={20} height={20} />
			</ListItemAvatar>
			<ListItemText>
				<Typography
					style={{
						whiteSpace: 'nowrap' /* 텍스트가 한 줄로 표시되도록 설정 */,
						overflow: 'hidden' /* 넘치는 텍스트를 숨김 */,
						textOverflow: 'ellipsis' /* 말줄임표(...)를 표시 */,
						fontSize: '12px',
					}}
				>
					{file.name}
				</Typography>
			</ListItemText>
		</ListItem>
	);
};
export const MainSection = () => {
	// const text = {
	// 	title: 'AI 채팅과 함께 작업을 해보세요.',
	// 	upload: '파일 업로드',
	// 	desc: '파일을 드래그하여 업로드하거나, 아래 공간을 클릭해 파일을 선택해 주세요.',
	// 	drag: 'PDF 파일을 여기로 드래그하거나\n여기를 클릭해서 파일을 업로드해 주세요.',
	// 	filename: 'filename.pdf',
	// };
	const text = {
		title: 'Chat with PDF file',
		upload: 'Upload File',
		desc: 'Select PDF files to upload. Please input chat name before upload.',
		drag: 'Please drag and drop your PDF file here or click here to upload your file.',
		submit: 'Submit PDF',
	};
	const {
		// selectedFile,
		selectedFiles,
		getRootProps,
		isDragActive,
		handleSubmit,
		alertOpen,
		alertContent,
		isLoading,
		onClose,
		inputRef,
		handleInputChange,
		handleMobileClick,
		handleFileElDelete,
		handleConvNameChange,
		conversationName,
	} = useDragnDrop();
	console.log('selected files: ', selectedFiles);
	return (
		<div css={sx.root}>
			<Stack css={sx.inner}>
				<Pcheader />
				<Typography textAlign='center' color={Color.WhiteText} variant='h1'>
					{text.title}
				</Typography>
				<div css={sx.dialog}>
					<Typography
						variant='h2'
						textAlign='center'
						color={Color.BlackText}
						mb='16px'
					>
						{text.upload}
					</Typography>
					<Typography
						variant='body2'
						textAlign='center'
						color={Color.GrayText4}
						mb='12px'
					>
						{text.desc}
					</Typography>
					<Stack>
						<Input
							placeholder='Chat Name'
							color='secondary'
							value={conversationName}
							onChange={handleConvNameChange}
							css={css`
								margin: 0 auto;
								input {
									text-align: center;
								}
							`}
						/>
					</Stack>

					<AlertDialog
						open={alertOpen}
						onClose={onClose}
						content={alertContent}
					/>
					<input
						type='file'
						accept='.pdf'
						style={{
							display: 'none',
						}}
						multiple={true}
						ref={inputRef}
						onChange={handleInputChange}
					></input>
					<Stack direction={'row'} gap={'12px'}>
						<Stack
							css={isDragActive ? sx.dashedBoxActive : sx.dashedBox}
							{...getRootProps({})}
							onClick={handleMobileClick}
						>
							<Image src={file} alt='file' width={20} height={11} />
							<Typography color={Color.BrandMain} css={sx.purpleText}>
								{text.drag}
							</Typography>
						</Stack>
						<List
							css={sx.fileInput}
							component='nav'
							aria-label='mailbox folders'
							dense={true}
						>
							{selectedFiles.map((file, index) => (
								<SelectedFileEl
									file={file}
									key={index}
									index={index}
									handleFileElDelete={handleFileElDelete}
								/>
							))}
						</List>
						{/* <Stack direction='row' css={sx.fileInput}>
							<Image src={pdf} alt='pdf' width={20} height={20} />
							<Typography variant='body2' color={Color.BrandMain}>
								{selectedFiles.map((file, index) => {
									return <SelectedFileEl key={index} file={file} />;
								})}
							</Typography>
						</Stack> */}
					</Stack>

					<Stack
						direction='row'
						gap='20px'
						alignItems='center'
						style={{
							display: 'flex',
							justifyContent: 'center',
						}}
					>
						{isLoading ? (
							<Button disabled={true} css={sx.button}>
								<CircularProgress size={25} />
							</Button>
						) : (
							<Button css={sx.button} onClick={handleSubmit}>
								{text.submit}
							</Button>
						)}
					</Stack>
				</div>
			</Stack>
		</div>
	);
};

const sx = {
	root: css`
		background-image: url(/assets/bg/upload_bg.png);
		background-size: cover;
		background-position: center;
		height: 670px;
		padding-top: 62px;
	`,
	inner: css`
		max-width: 1000px;
		margin: 0 auto;
		justify-content: center;
		height: 100%;
		gap: 40px;
		@media ${Mq.xl} {
			padding-left: 60px;
			padding-right: 60px;
		}
	`,
	dialog: css`
		padding: 40px;
		background-color: #ffffffa8;
		border-radius: 20px;
	`,
	dashedBox: css`
		height: 160px;
		background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='10' ry='10' stroke='%23B13FDCFF' stroke-width='4' stroke-dasharray='22' stroke-dashoffset='32' stroke-linecap='square'/%3e%3c/svg%3e");
		border-radius: 10px;
		margin: 20px 0;
		align-items: center;
		justify-content: center;
		gap: 16px;
		cursor: pointer;
		background-color: #ffff;
		width: calc((100% - 12px) / 2);
	`,
	dashedBoxActive: css`
		height: 160px;
		background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='10' ry='10' stroke='%23B13FDCFF' stroke-width='4' stroke-dasharray='22' stroke-dashoffset='32' stroke-linecap='square'/%3e%3c/svg%3e");
		border-radius: 10px;
		margin: 20px 0;
		align-items: center;
		justify-content: center;
		gap: 16px;
		cursor: pointer;
		background-color: ${Color.lightPurple};
	`,
	purpleText: css`
		font-size: 12px !important;
		text-align: center;
	`,
	fileInput: css`
		background-color: #ffff;
		/* width: 50%; */
		width: calc((100% - 12px) / 2);
		padding: 13px;
		border-radius: 10px;
		align-items: center;
		/* height: 100%; */
		margin: 20px 0;
		height: 160px;
		overflow-y: scroll;
	`,
	button: css`
		color: #fff;
		background-color: ${Color.BrandMain};
		width: 100%;
		height: 46px;
		padding: 12px;
		font-size: 15px;
		border-radius: 10px;
		line-height: 26px;
		word-break: keep-all;
		&:hover {
			background-color: ${Color.hoverBrandMain};
		}
	`,
	xbutton: css`
		margin: 0;
	`,
};
