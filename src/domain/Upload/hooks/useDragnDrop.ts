import useAlert from '@/common/hooks/useAlert';
import { TrootState } from '@/redux/reducers';
import axiosAPI from '@/utils/axiosAPI';
import checkFileExtension from '@/utils/checkFileType';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSelector } from 'react-redux';
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
	const auth = useSelector((state: TrootState) => state);
	const router = useRouter();
	const { getRootProps, isDragActive } = useDropzone({
		onDrop: async (files) => {
			console.log('files: ', files);
			console.log('on drop');
			// const file = files[0];
			// if (!file?.name) {
			// 	return false;
			// }
			if (!files.length) {
				return false;
			}
			const totalSize = files.reduce((total, file) => total + file.size, 0);

			if (!checkFileSize(totalSize, fileSizes['1mb'] * 20)) {
				toggleOpen('The limit of file size is under 20mb', true, () => {
					toggleOpen('', false, () => {});
				});
				return;
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
			// setSelectedFile(file);
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
			// const file = evt.currentTarget.files[0];
			// console.log('file: ', file);
			// if (!checkFileExtension(file.name, ['pdf'])) {
			// 	toggleOpen('You can only upload PDF files.', true, () => {
			// 		toggleOpen('', false, () => {});
			// 	});
			// } else if (!checkFileSize(file.size, fileSizes['1mb'] * 10)) {
			// 	toggleOpen('The limit of file size is under 10mb', true, () => {
			// 		toggleOpen('', false, () => {});
			// 	});
			// } else {
			// 	setSelectedFile(file);
			// }
			const files = Array.from(evt.currentTarget.files);
			//check is empty
			if (!files.length) {
				return false;
			}

			//check total size
			const totalSize = files.reduce((total, file) => total + file.size, 0);
			if (!checkFileSize(totalSize, fileSizes['1mb'] * 50)) {
				toggleOpen('The limit of file size is under 20mb', true, () => {
					toggleOpen('', false, () => {});
				});
				return;
			}

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
		if (!auth.isLoggedIn) {
			toggleOpen('You need to login first.', true, () => {
				setIsLoading(false);
				toggleOpen('', false, () => {});
				// window.location.href = '/login';
				router.push('/login');
			});
			return;
		}
		// if (!selectedFile) {
		// 	window.alert('파일을 선택해주세요.');
		// 	setIsLoading(false);
		// 	return;
		// }
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
		axiosAPI({
			method: 'POST',
			url: '/conversation/v9',
			data: formData,
		})
			// .then((response) => {
			// 	console.log('create response: ', response);
			// 	return axiosAPI({
			// 		method: 'PATCH',
			// 		url: '/conversation/last',
			// 		data: {
			// 			convId: response.data.createdId,
			// 		},
			// 	});
			// })
			.then((response) => {
				console.log('patch response : ', response);
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
		// selectedFile,
		selectedFiles,
		handleSubmit,
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
