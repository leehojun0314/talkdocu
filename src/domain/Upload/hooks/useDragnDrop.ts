import useAlert from '@/common/hooks/useAlert';
import { TrootState } from '@/redux/reducers';
import axiosAPI from '@/utils/axiosAPI';
import checkFileExtension from '@/utils/checkFileType';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSelector } from 'react-redux';
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
			setSelectedFile(file);
		},
		accept: {
			'application/pdf': ['.pdf'],
		},
		onDropRejected: (files) => {
			console.log('drop rejected : ', files);
			toggleOpen('PDF, Text 파일만 업로드 할 수 있습니다.', true, () => {
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
		if (evt.currentTarget.files) {
			const file = evt.currentTarget.files[0];
			console.log('file: ', file);
			if (!checkFileExtension(file.name, ['pdf'])) {
				toggleOpen('PDF, Text 파일만 업로드 할 수 있습니다.', true, () => {
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
			url: '/conversation/v5',
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
					'Upload complete. The time it takes for AI to learn may take longer depending on the size of the file.',
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
