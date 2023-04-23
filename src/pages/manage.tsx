import useLoginCheck from '@/common/hooks/useLoginCheck';
import { ManageView } from '@/domain/manage/manageView';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

const ManagePage: NextPage = () => {
	const router = useRouter();
	useLoginCheck(undefined, () => {
		window.alert('로그인이 필요한 서비스입니다.');
		// window.location.href = '/login';
		router.push('/login');
	});
	return <ManageView />;
};
export default ManagePage;
