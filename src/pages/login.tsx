import { LoginView } from '@/domain/Login/LoginView';
import { NextPage } from 'next';
import Head from 'next/head';

const LoginPage: NextPage = () => {
	return (
		<>
			<Head>
				<title>Login</title>
			</Head>
			<LoginView />
		</>
	);
};
export default LoginPage;
