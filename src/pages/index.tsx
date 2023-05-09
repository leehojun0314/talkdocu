import useLoginCheck from '@/common/hooks/useLoginCheck';
import { UploadView } from '@/domain/Upload/UploadView';
import { NextPage } from 'next';
import Head from 'next/head';

const MainPage: NextPage = () => {
	useLoginCheck();
	return (
		<>
			<Head>
				<title>TalkDocu</title>
			</Head>
			<UploadView />
		</>
	);
};

export default MainPage;
