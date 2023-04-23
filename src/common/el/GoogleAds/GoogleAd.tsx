import { useEffect } from 'react';

declare global {
	interface Window {
		adsbygoogle: any;
	}
}

const GoogleAd = () => {
	useEffect(() => {
		(window.adsbygoogle = window.adsbygoogle || []).push({});
	}, []);

	return (
		<div className='googleAd-container'>
			{/* <ins
				className='adsbygoogle'
				data-ad-format='auto'
				// data-ad-layout-key='-fb+5w+4e-db+86'
				data-ad-client='ca-pub-7554551043921031'
				data-ad-slot='7434970023'
				data-full-width-responsive='true'
			/> */}
			<ins
				className='adsbygoogle'
				style={{ display: 'block' }}
				data-ad-client='ca-pub-7554551043921031'
				data-ad-slot='7601665916'
				data-ad-format='auto'
				data-full-width-responsive='true'
			></ins>
		</div>
	);
};

export default GoogleAd;
