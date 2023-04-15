import { useCallback, useState } from 'react';

export default function useAlert() {
	const [open, setOpen] = useState<boolean>(false);
	const [ct, setContent] = useState<string>('');
	const [onCloseCallback, setOncloseCallback] = useState<() => void>(() => {});
	function toggleOpen(content: string, isOpen: boolean, onClose?: () => void) {
		setOpen(isOpen);
		setContent(content);
		if (onClose) {
			setOncloseCallback(() => onClose); //함수를 직접적으로 할당하면 함수가 실행되는 현상이 있음.
		} else {
			setOncloseCallback(() => {});
		}
	}

	return { open, toggleOpen, content: ct, onClose: onCloseCallback };
}
