import useAlert from '@/common/hooks/useAlert';
import checkFileExtension from '@/utils/checkFileType';
import axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { extractTextFromFile } from '@/lib/extractTextFromPDF';
const fileSizes = {
	'1gb': 1024 * 1024 * 1024,
	'1mb': 1024 * 1024,
	'1kb': 1024,
	'1byte': 1,
};
export function checkFileSize(fileSize: number, limit: number) {
	if (fileSize < limit) {
		return true;
	} else {
		return false;
	}
}
function useDragnDrop() {
	// const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
	const [conversationName, setConversationName] = useState<string>();
	const { open, toggleOpen, content, onClose } = useAlert();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement>(null);
	// const auth = useSelector((state: TrootState) => state);
	const { status, data } = useSession();
	const router = useRouter();
	const { getRootProps, isDragActive } = useDropzone({
		onDrop: async (files) => {
			if (!files.length) {
				return false;
			}
			for (let i = 0; i < files.length; i++) {
				if (!checkFileExtension(files[i].name, ['pdf'])) {
					toggleOpen('You can only upload PDF files.', true, () => {
						toggleOpen('', false, () => {});
					});
					return;
				}
			}
			setSelectedFiles((pre) => {
				return [...pre, ...files];
			});
		},
		accept: {
			'application/pdf': ['.pdf'],
		},
		onDropRejected: (files) => {
			console.log('drop rejected : ', files);
			toggleOpen('You can only upload PDF files.', true, () => {
				toggleOpen('', false, () => {});
			});
		},
	});
	function handleMobileClick() {
		if (inputRef) {
			inputRef.current?.click();
		}
	}
	function handleFileElDelete(index: number) {
		return (evt: React.MouseEvent<HTMLButtonElement>) => {
			const newFileList = [...selectedFiles];
			newFileList.splice(index, 1);
			setSelectedFiles(newFileList);
		};
	}
	function handleInputChange(evt: React.ChangeEvent<HTMLInputElement>) {
		if (evt.currentTarget.files?.length) {
			const files = Array.from(evt.currentTarget.files);
			//check is empty
			if (!files.length) {
				return;
			}

			//check total size
			// const totalSize = files.reduce((total, file) => total + file.size, 0);
			// // if (!checkFileSize(totalSize, fileSizes['1mb'] * 50)) {
			// // 	toggleOpen('The limit of file size is under 50mb', true, () => {
			// // 		toggleOpen('', false, () => {});
			// // 	});
			// // 	return;
			// // }

			//check file type
			for (let i = 0; i < files.length; i++) {
				if (!checkFileExtension(files[i].name, ['pdf'])) {
					toggleOpen('You can only upload PDF files.', true, () => {
						toggleOpen('', false, () => {});
					});
					return;
				}
			}
			// setSelectedFiles(files);
			setSelectedFiles((pre) => {
				return [...pre, ...files];
			});
		}
	}
	function handleConvNameChange(evt: React.ChangeEvent<HTMLInputElement>) {
		setConversationName(evt.target.value);
	}
	function handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
		event.preventDefault();
		console.log('submit clicked');
		setIsLoading(true);
		if (status === 'loading') {
			return;
		}
		if (status === 'unauthenticated') {
			toggleOpen('You need to login first.', true, () => {
				setIsLoading(false);
				toggleOpen('', false, () => {});
				// window.location.href = '/login';
				// router.push('/login');
				window.sessionStorage.setItem('redirect', window.location.href);

				signIn();
			});
			return;
		}
		if (!selectedFiles.length) {
			// window.alert('Please select a file');
			toggleOpen('Please select a file. ', true, () => {
				setIsLoading(false);
				toggleOpen('', false, () => {});
			});
			return;
		}
		if (!conversationName?.length) {
			toggleOpen('Please enter chat name.', true, () => {
				setIsLoading(false);
				toggleOpen('', false, () => {});
			});
			// window.alert('Please Enter a conversation name');
			return;
		}
		const formData = new FormData();
		// formData.append('file', selectedFile);
		for (let i = 0; i < selectedFiles.length; i++) {
			formData.append(`file${i}`, selectedFiles[i]);
		}
		formData.append('conversationName', conversationName || '');
		axios
			.post('/api/conversation/create', formData)
			.then((response) => {
				console.log('response: ', response);
				toggleOpen(
					'Upload complete. Please wait until it finishes analyze.',
					true,
					() => {
						toggleOpen('', false, () => {});
						// window.location.href = '/chat';
						router.push('/manage');
					},
				);
			})
			.catch((err) => {
				console.log('err: ', err);
				const text = err.response?.data;
				toggleOpen(
					typeof text === 'string' && text.length > 0
						? text
						: 'Unexpected Error occured.',
					true,
					() => {
						toggleOpen('', false, () => {});
					},
				);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}
	async function handleSubmit2(event: React.MouseEvent<HTMLButtonElement>) {
		event.preventDefault();
		console.log('submit clicked');
		setIsLoading(true);
		if (status === 'loading') {
			return;
		}
		if (status === 'unauthenticated') {
			toggleOpen('You need to login first.', true, () => {
				setIsLoading(false);
				toggleOpen('', false, () => {});
				// window.location.href = '/login';
				// router.push('/login');
				window.sessionStorage.setItem('redirect', window.location.href);

				signIn();
			});
			return;
		}
		if (!selectedFiles.length) {
			// window.alert('Please select a file');
			toggleOpen('Please select a file. ', true, () => {
				setIsLoading(false);
				toggleOpen('', false, () => {});
			});
			return;
		}
		console.log('selected files: ', selectedFiles);
		if (!conversationName?.length) {
			toggleOpen('Please enter chat name.', true, () => {
				setIsLoading(false);
				toggleOpen('', false, () => {});
			});
			// window.alert('Please Enter a conversation name');
			return;
		}
		const documents: {
			documentName: string;
			documentSize: number;
			pages: string[];
		}[] = [];
		for (let i = 0; i < selectedFiles.length; i++) {
			console.log('selected file: ', selectedFiles[i]);
			const textPages: string[] = await extractTextFromFile(
				selectedFiles[i],
			);
			documents.push({
				documentName: selectedFiles[i].name,
				documentSize: selectedFiles[i].size,
				pages: textPages,
			});
		}
		console.log('documents: ', documents);
		axios({
			method: 'post',
			url: '/api/conversation/create_edge',
			headers: {
				'Content-Type': 'application/json',
			},
			data: JSON.stringify({
				conversationName,
				documents,
			}),
		})
			.then((response) => {
				console.log('response: ', response);
				toggleOpen(
					'Upload complete. Please wait until it finishes analyze.',
					true,
					() => {
						toggleOpen('', false, () => {});
						// window.location.href = '/chat';
						router.push('/manage');
					},
				);
			})
			.catch((err) => {
				console.log('err: ', err);
				const text = err.response?.data;
				toggleOpen(
					typeof text === 'string' && text.length > 0
						? text
						: 'Unexpected Error occured.',
					true,
					() => {
						toggleOpen('', false, () => {});
					},
				);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}
	return {
		selectedFiles,
		handleSubmit: handleSubmit2,
		getRootProps,
		isDragActive,
		alertOpen: open,
		alertContent: content,
		isLoading,
		onClose,
		handleMobileClick,
		handleInputChange,
		inputRef,
		handleFileElDelete,
		handleConvNameChange,
		conversationName,
	};
}
export default useDragnDrop;
