import useLoginCheck from '@/common/hooks/useLoginCheck';
import { UploadView } from '@/domain/Upload/UploadView';
import { NextPage } from 'next';

const MainPage: NextPage = () => {
	useLoginCheck();
	return <UploadView />;
};

export default MainPage;
