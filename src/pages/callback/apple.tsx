import axiosAPI from '@/utils/axiosAPI';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { login, logout } from '@/redux/reducers/actions';
const AppleCallbackPage: NextPage = () => {
	const router = useRouter();
	const dispatch = useDispatch();
	useEffect(() => {
		const code = new URLSearchParams(window.location.search).get('code');
		console.log('code : ', code);
		axiosAPI({
			method: 'GET',
			url: `/auth/apple?code=${code}&redirect_uri=${window.location.origin}/callback/apple`,
		})
			.then((response) => {
				console.log('response: ', response);
				if (response.status === 200) {
					const { jwt, userData } = response.data;
					localStorage.setItem('token', jwt);

					dispatch(login({ userData, isLoggedIn: true }));
					router.push('/');
				} else {
					dispatch(logout());
				}
			})
			.catch((err) => {
				console.log('err : ', err.response);
				// router.push('/error');
			});
	}, []);
	return <div></div>;
};
export default AppleCallbackPage;
