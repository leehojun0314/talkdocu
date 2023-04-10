import { useDropzone } from 'react-dropzone';
function useDragnDrop() {
	const { getRootProps, isDragActive } = useDropzone({
		onDrop: async (files) => {
			console.log('files: ', files);
		},
	});
	return {
		getRootProps,
		isDragActive,
	};
}
export default useDragnDrop;
