export default function checkFileExtension(
	fileName: string | undefined,
	extensions: string[],
): boolean {
	const extension = fileName?.split('.').pop()?.toLowerCase();
	return extensions.some((ext) => ext.toLowerCase() === extension);
}
