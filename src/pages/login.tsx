import useLoginCheck from '@/common/hooks/useLoginCheck';
import { LoginView } from '@/domain/Login/LoginView';
import { NextPage } from 'next';

const LoginPage: NextPage = () => {
	return <LoginView />;
};
export default LoginPage;
