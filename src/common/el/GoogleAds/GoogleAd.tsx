import { useEffect } from 'react';
// ca - pub - 7554551043921031;
declare global {
	interface Window {
		adsbygoogle: any;
	}
}

const GoogleAd = ({
	className = 'adsbygoogle',
	client = '',
	slot = '',
	format = '',
	responsive = '',
	layoutKey = '',
}) => {
	useEffect(() => {
		try {
			(window.adsbygoogle = window.adsbygoogle || []).push({});
			console.log('Advertise is pushed');
		} catch (e) {
			if (process.env.NODE_ENV !== 'production')
				console.error('AdvertiseError', e);
		}
	}, []);
	if (process.env.NODE_ENV !== 'production')
		return (
			<div
				style={{
					background: '#e9e9e9',
					color: 'black',
					fontSize: '18px',
					fontWeight: 'bold',
					textAlign: 'center',
					height: '500px',
					padding: '0 10px',
				}}
			>
				광고 표시 영역
			</div>
		);
	return (
		<div className='googleAd-container'>
			{/* <ins
				className='adsbygoogle'
				style={{ display: 'block' }}
				data-ad-client='ca-pub-7554551043921031'
				data-ad-slot='7601665916'
				data-ad-format='auto'
				data-full-width-responsive='true'
			></ins> */}
			<ins
				className={className}
				style={{
					overflowX: 'auto',
					overflowY: 'hidden',
					display: 'block',
					textAlign: 'center',
					height: '500px',
					padding: '0 10px',
				}}
				data-ad-client={client}
				data-ad-slot={slot}
				data-ad-format={format}
				data-full-width-responsive={responsive}
				data-ad-layout-key={layoutKey}
			/>
		</div>
	);
};

export default GoogleAd;
