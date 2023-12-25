import { TrootState } from '@/redux/reducers';
import { logout } from '@/redux/reducers/actions';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
// import { useSelector } from 'react-redux';

export default function usePCheader() {
	const [scrollPosition, setScrollPosition] = useState(0);
	// const auth = useSelector((state: TrootState) => state);
	const dispatch = useDispatch();
	const [popoverEl, setPopoverEl] = useState<HTMLElement | null>(null);
	const profilePopover = Boolean(popoverEl);
	function handleProfilePopOpen(event: React.MouseEvent<HTMLElement>) {
		setPopoverEl(event.currentTarget);
	}
	function handleProfilePopClose(event: React.MouseEvent<HTMLElement>) {
		setPopoverEl(null);
	}
	function updateScroll() {
		setScrollPosition(window.scrollY || document.documentElement.scrollTop);
	}
	function handleLogout() {
		setPopoverEl(null);
		localStorage.setItem('token', '');
		dispatch(logout());
		const pathname = window.location.pathname;
		if (pathname.includes('chat') || pathname.includes('manage')) {
			window.location.href = '/';
		}
	}
	function handleLogout2() {
		setPopoverEl(null);
		const pathname = window.location.pathname;
		if (pathname.includes('chat') || pathname.includes('manage')) {
			window.location.href = '/';
		}
	}

	useEffect(() => {
		window.addEventListener('scroll', updateScroll);
	}, []);
	const navModels = [
		{ link: '/', title: 'Upload' },
		{ link: '/manage', title: 'Chats' },
		// { link: '/manage', title: 'Manage' },
		// { link: '/plan', title: '요금제' },
	];
	return {
		scrollPosition,
		profilePopover,
		popoverEl,
		navModels,
		handleProfilePopClose,
		handleProfilePopOpen,
		handleLogout,
		handleLogout2,
	};
}
