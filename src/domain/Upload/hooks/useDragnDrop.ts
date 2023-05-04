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
function checkFileSize(fileSize: number, limit: number) {
	if (fileSize < limit) {
		return true;
	} else {
		return false;
	}
}
function useDragnDrop() {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const { open, toggleOpen, content, onClose } = useAlert();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const auth = useSelector((state: TrootState) => state);
	const router = useRouter();
	const { getRootProps, isDragActive } = useDropzone({
		onDrop: async (files) => {
			console.log('files: ', files);
			console.log('on drop');
			const file = files[0];
			if (!file?.name) {
				return false;
			}
			if (!checkFileSize(file.size, fileSizes['1mb'] * 10)) {
				toggleOpen('The limit of file size is under 10mb', true, () => {
					toggleOpen('', false, () => {});
				});
				return;
			}
			setSelectedFile(file);
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
		console.log('mobile click : ', inputRef);
		if (inputRef) {
			inputRef.current?.click();
		}
	}
	function handleInputChange(evt: React.ChangeEvent<HTMLInputElement>) {
		console.log('input changed: ', evt);
		if (evt.currentTarget.files?.length) {
			const file = evt.currentTarget.files[0];
			console.log('file: ', file);
			if (!checkFileExtension(file.name, ['pdf'])) {
				toggleOpen('You can only upload PDF files.', true, () => {
					toggleOpen('', false, () => {});
				});
			} else if (!checkFileSize(file.size, fileSizes['1mb'] * 10)) {
				toggleOpen('The limit of file size is under 10mb', true, () => {
					toggleOpen('', false, () => {});
				});
			} else {
				setSelectedFile(file);
			}
		}
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
		if (!selectedFile) {
			window.alert('파일을 선택해주세요.');
			setIsLoading(false);
			return;
		}
		const formData = new FormData();
		formData.append('file', selectedFile);
		formData.append('conversationName', selectedFile?.name);
		axiosAPI({
			method: 'POST',
			url: '/conversation/v7',
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
				toggleOpen('Upload complete.', true, () => {
					toggleOpen('', false, () => {});
					// window.location.href = '/chat';
					router.push('/manage');
				});
			})
			.catch((err) => {
				console.log('err: ', err);
				const text = err.response.data;

				toggleOpen(text ? text : 'Unexpected Error occured.', true, () => {
					toggleOpen('', false, () => {});
				});
			})
			.finally(() => {
				setIsLoading(false);
			});
	}
	return {
		selectedFile,
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
	};
}
export default useDragnDrop;
