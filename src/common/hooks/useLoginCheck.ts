import { useDispatch } from 'react-redux';
import { login, logout } from '@/redux/reducers/actions';
import axiosAPI from '@/utils/axiosAPI';
import { useEffect } from 'react';
import { TrootState } from '@/redux/reducers';
export default function useLoginCheck(
	onLogin?: (auth: TrootState) => void,
	onLogout?: () => void,
) {
	const dispatch = useDispatch();
	function checkLoginStatus() {
		axiosAPI({
			method: 'GET',
			url: '/auth/checkLogin',
		})
			.then((response) => {
				// console.log('check2	 response:', response);
				console.log('check login : ', response.data);
				const data = response.data;
				if (data.isLoggedIn) {
					dispatch(
						login({
							userData: data.userData,
							isLoggedIn: response.data.isLoggedIn,
						}),
					);

					typeof onLogin === 'function' &&
						onLogin({
							userData: data.userData,
							isLoggedIn: response.data.isLoggedIn,
						});
				} else {
					dispatch(logout());
					typeof onLogout === 'function' && onLogout();
				}
			})
			.catch((err) => {
				console.log('auth check err: ', err);
				dispatch(logout());
				typeof onLogout === 'function' && onLogout();
			});
	}
	useEffect(() => {
		if (localStorage.getItem('token')) {
			checkLoginStatus();
		}
	}, []);
}
