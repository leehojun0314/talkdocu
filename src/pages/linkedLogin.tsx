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
			let stringjwt = '';
			if (!jwt) {
				console.log('jwt is required');
				return;
			}
			console.log('jwt : ', jwt);
			if (typeof jwt === 'string') {
				stringjwt = jwt;
				localStorage.setItem('token', stringjwt);
			} else {
				return;
			}
			console.log('localstorage jwt : ', localStorage.getItem('token'));
			axiosAPI({
				method: 'GET',
				url: '/auth/dtizenCheckLogin',
			})
				.then((res) => {
					console.log('res: ', res);
					localStorage.setItem('token', stringjwt);
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
