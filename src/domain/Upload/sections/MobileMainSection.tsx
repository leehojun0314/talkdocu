import { MobileHeader } from '@/common/el';
import { Color } from '@/common/theme/colors';
import { css } from '@emotion/react';
import {
	Button,
	CircularProgress,
	Icon,
	IconButton,
	List,
	ListItem,
	ListItemText,
	ListItemAvatar,
	Stack,
	Typography,
	Input,
} from '@mui/material';
import add from '@/assets/icons/add.png';
import Image from 'next/image';
import pdf from '@/assets/icons/pdf_white.png';
import useDragnDrop from '../hooks/useDragnDrop';
import AlertDialog from '@/common/el/Dialog/alertDialog';
import AddIcon from '@mui/icons-material/Add';
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
export const MobileMainSection = () => {
	const {
		selectedFiles,
		handleSubmit,
		alertOpen,
		alertContent,
		isLoading,
		onClose,
		handleMobileClick,
		handleInputChange,
		inputRef,
		handleFileElDelete,
		handleConvNameChange,
		conversationName,
	} = useDragnDrop();
	const text = {
		title: 'Chat with PDF file',
		upload: 'Upload File',
		click: 'Please click the button to select a file.',

		submit: 'Submit PDF',
	};
	return (
		<div css={sx.root}>
			<AlertDialog
				open={alertOpen}
				onClose={onClose}
				content={alertContent}
			/>
			<MobileHeader />
			<Stack>
				<Stack direction='row' css={sx.uploadWrap}>
					<Stack gap='10px'>
						<Typography variant='h5' color={Color.GrayText2}>
							{text.upload}
						</Typography>
						<Typography css={sx.desc} color={Color.GrayText2}>
							{text.click}
						</Typography>
					</Stack>

					{/* <div {...getRootProps()}> */}

					<input
						type='file'
						accept='.pdf'
						style={{
							display: 'none',
						}}
						ref={inputRef}
						onChange={handleInputChange}
						multiple={true}
					></input>
					{/* </div> */}
				</Stack>
				<Input
					placeholder='Chat Name'
					color='secondary'
					style={{
						color: '#ffff',
						marginTop: '20px',
					}}
					onChange={handleConvNameChange}
					value={conversationName}
				/>

				<div
					className='upload-button'
					css={sx.uploadBtn}
					onClick={handleMobileClick}
				>
					<AddIcon
						fontSize='medium'
						style={{
							color: '#ffffff',
						}}
					>
						add_circle
					</AddIcon>
				</div>
				{/* <Image src={pdf} alt='pdf' width={24} height={24} />
					<Typography variant='body2' color={Color.WhiteText}>
						{selectedFile?.name}
					</Typography> */}
				{selectedFiles.length > 0 && (
					<List component={'nav'} css={sx.fileList}>
						{selectedFiles.map((file, index) => {
							return (
								<SelectedFileEl
									file={file}
									index={index}
									key={index}
									handleFileElDelete={handleFileElDelete}
								/>
							);
						})}
					</List>
				)}
				{isLoading ? (
					<Button disabled={true} css={sx.button}>
						<CircularProgress />
					</Button>
				) : (
					<Button css={sx.button} onClick={handleSubmit}>
						{text.submit}
					</Button>
				)}
			</Stack>
		</div>
	);
};

const sx = {
	root: css`
		background-image: url('/assets/bg/upload_bg.png');

		background-position: center;
		position: relative;
		width: 100%;
		padding: 82px 20px 20px 20px;
	`,
	uploadWrap: css`
		justify-content: space-between;
	`,
	desc: css`
		font-size: 12px !important;
	`,

	button: css`
		background-color: ${Color.BrandMain};
		color: #fff;
		height: 50px;
		&:hover {
			background-color: ${Color.hoverBrandMain};
		}
	`,
	uploadBtn: css`
		display: flex;
		width: 100%;
		background-color: rgba(247, 235, 252, 0.5);
		border-radius: 10px;
		margin: 18px 0;
		padding: 0;
		height: 60px;
		justify-content: center;
		align-items: center;
	`,
	fileList: css`
		width: 100%;
		max-height: 300px;
		overflow-y: scroll;
		align-items: center;
		background: rgba(247, 235, 252, 0.5);
		padding: 12px;
		border-radius: 10px;
		margin: 20px 0;
	`,
};
