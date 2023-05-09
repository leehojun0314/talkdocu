import { TermsView } from '@/domain/terms/termsView';
import { NextPage } from 'next';
import Head from 'next/head';

const TermsPage: NextPage = () => {
	return (
		<>
			<Head>
				<title>Terms</title>
			</Head>
			<TermsView />
		</>
	);
};

export default TermsPage;
