import axiosAPI from '@/utils/axiosAPI';
import axios from 'axios';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const LinkedLoginPage: NextPage = () => {
	const router = useRouter();
	useEffect(() => {
		if (router.isReady) {
			const jwt = router.query.jwt;
			console.log('jwt : ', jwt);
			if (typeof jwt === 'string') {
				localStorage.setItem('token', jwt);
			}
			console.log('localstorage jwt : ', localStorage.getItem('token'));
			axiosAPI({
				method: 'GET',
				url: '/auth/dtizenCheckLogin',
			})
				.then((res) => {
					console.log('res: ', res);
					router.push('/');
				})
				.catch((err) => {
					console.log('err: ', err);
					localStorage.setItem('token', '');
					router.push('/error');
				});
		}
	}, [router]);
	return (
		<>
			<Head>
				<title>LinkedLogin</title>
			</Head>
			{/* <>jwt: {router.query.jwt}</> */}
		</>
	);
};
export default LinkedLoginPage;
