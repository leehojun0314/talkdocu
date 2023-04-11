// |이 코드는 Next.js에서 사용되는 GoogleCallbackPage 컴포넌트를 정의하는 코드입니다.
// |
// |좋은 점:
// |- Next.js에서 제공하는 NextPage 타입을 import하여 사용하고 있습니다. 이는 Next.js에서 제공하는 타입으로, Next.js에서 사용되는 페이지 컴포넌트의 타입을 정의하고 있습니다.
// |- GoogleCallbackPage 함수는 현재는 빈 함수이지만, Google 로그인 콜백 페이지를 구현하기 위한 함수로 사용될 것입니다.
// |
// |나쁜 점:
// |- 현재는 Google 로그인 콜백 페이지를 구현하기 위한 코드가 없으므로, 이 코드 자체로는 동작하지 않습니다.
import axiosAPI from '@/utils/axiosAPI';
import axios from 'axios';
import { NextPage } from 'next';
import getConfig from 'next/config';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const GoogleCallbackPage: NextPage = () => {
	const router = useRouter();
	useEffect(() => {
		const code = new URLSearchParams(window.location.search).get('code');
		console.log('code : ', code);
		axiosAPI({
			method: 'GET',
			url: `/auth/google?code=${code}&redirect_uri=${window.location.origin}/callback/google`,
		})
			.then((response) => {
				console.log('response: ', response);
				if (response.status === 200) {
					router.push('/');
				}
			})
			.catch((err) => {
				console.log('err : ', err.response);
				router.push('/error');
			});
	}, []);
	return <div></div>;
};
export default GoogleCallbackPage;
