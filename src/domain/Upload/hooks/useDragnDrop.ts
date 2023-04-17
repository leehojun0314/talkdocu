import useAlert from '@/common/hooks/useAlert';
import axiosAPI from '@/utils/axiosAPI';
import checkFileExtension from '@/utils/checkFileType';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
function useDragnDrop() {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const { open, toggleOpen, content, onClose } = useAlert();
	const [isLoading, setIsLoading] = useState<boolean>(false);
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
	function handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
		event.preventDefault();
		console.log('submit clicked');
		setIsLoading(true);
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
	};
}
export default useDragnDrop;
