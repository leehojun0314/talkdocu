import useAlert from '@/common/hooks/useAlert';
import { TrootState } from '@/redux/reducers';
import axiosAPI from '@/utils/axiosAPI';
import checkFileExtension from '@/utils/checkFileType';
import React, { useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSelector } from 'react-redux';
function useDragnDrop() {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const { open, toggleOpen, content, onClose } = useAlert();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const auth = useSelector((state: TrootState) => state);
	const { getRootProps, isDragActive } = useDropzone({
		onDrop: async (files) => {
			console.log('files: ', files);
			console.log('on drop');
			const file = files[0];
			if (!file?.name) {
				return false;
			}
			// if (!checkFileExtension(file.name, ['pdf', 'txt'])) {
			// 	toggleOpen('PDF, Text 파일만 업로드 할 수 있습니다.');
			// 	return;
			// }
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
			if (!checkFileExtension(file.name, ['pdf', 'txt'])) {
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
			toggleOpen('로그인이 필요한 서비스입니다.', true, () => {
				toggleOpen('', false, () => {});
				window.location.href = '/login';
			});
			return;
		}
		if (!selectedFile) {
			window.alert('파일을 선택해주세요.');
			return;
		}
		const formData = new FormData();
		formData.append('file', selectedFile);
		formData.append('conversationName', selectedFile?.name);
		axiosAPI({
			method: 'POST',
			url: '/conversation/v3',
			data: formData,
		})
			.then((response) => {
				console.log('create response: ', response);
				return axiosAPI({
					method: 'PATCH',
					url: '/conversation/last',
					data: {
						convId: response.data.createdId,
					},
				});
			})
			.then((response) => {
				console.log('patch response : ', response);
				setIsLoading(false);
				toggleOpen('업로드가 완료되었습니다.', true, () => {
					toggleOpen('', false, () => {});
					window.location.href = '/chat';
				});
			})
			.catch((err) => {
				console.log('err: ', err);
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
