import { ManageView } from '@/domain/manage/manageView';
import { NextPage } from 'next';
import Head from 'next/head';

const ManagePage: NextPage = () => {
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
