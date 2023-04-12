import useAlert from '@/common/hooks/useAlert';
import axiosAPI from '@/utils/axiosAPI';
import checkFileExtension from '@/utils/checkFileType';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
function useDragnDrop() {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const { open, toggleOpen, content } = useAlert();
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
			toggleOpen('PDF, Text 파일만 업로드 할 수 있습니다.');
		},
	});
	function handleSubmit(event: React.MouseEvent<HTMLButtonElement>) {
		event.preventDefault();
		console.log('submit clicked');
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
				console.log('response: ', response);
			})
			.catch((err) => {
				console.log('err: ', err);
			});
	}
	return {
		selectedFile,
		handleSubmit,
		getRootProps,
		isDragActive,
		alertOpen: open,
		alertContent: content,
		toggleAlert: toggleOpen,
	};
}
export default useDragnDrop;
