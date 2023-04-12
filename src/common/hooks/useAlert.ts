import { useState } from 'react';

export default function useAlert() {
	const [open, setOpen] = useState<boolean>(false);
	const [ct, setContent] = useState<string>('');
	function toggleOpen(content: string, isOpen?: boolean) {
		if (isOpen === undefined) {
			setOpen(!open);
		} else {
			setOpen(isOpen);
		}
		setContent(content);
	}
	return { open, toggleOpen, content: ct };
}
