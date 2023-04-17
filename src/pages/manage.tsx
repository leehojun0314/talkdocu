import useLoginCheck from '@/common/hooks/useLoginCheck';
import { ManageView } from '@/domain/manage/manageView';
import { NextPage } from 'next';

const ManagePage: NextPage = () => {
	useLoginCheck();
	return <ManageView />;
};
export default ManagePage;
