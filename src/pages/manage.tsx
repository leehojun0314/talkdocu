import useLoginCheck from '@/common/hooks/useLoginCheck';
import { ManageView } from '@/domain/manage/manageView';
import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

const ManagePage: NextPage = () => {
	const router = useRouter();
	useLoginCheck(undefined, () => {
		window.alert('로그인이 필요한 서비스입니다.');
		// window.location.href = '/login';

		router.push('/login');
	});
	return (
		<>
			<Head>
				<title>Manage</title>
			</Head>
			<ManageView />
		</>
	);
};
export default ManagePage;
