import '@/common/styles/globals.css';
import { lightTheme } from '@/common/theme/customTheme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import store from '@/redux/store';
import { useEffect } from 'react';
import axiosAPI from '@/utils/axiosAPI';
import getConfig from 'next/config';
const { NODE_ENV_CLI } = getConfig().publicRuntimeConfig;

export default function App({ Component, pageProps }: AppProps) {
	function googleTagManager(w: any, d: any, s: any, l: any, i: any) {
		w[l] = w[l] || [];
		w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
		var f = d.getElementsByTagName(s)[0],
			j = d.createElement(s),
			dl = l != 'dataLayer' ? '&l=' + l : '';
		j.async = true;
		j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
		f.parentNode.insertBefore(j, f);
	}
	useEffect(() => {
		googleTagManager(window, document, 'script', 'dataLayer', 'GTM-WBB4N3M');
		if (NODE_ENV_CLI === 'development') {
			axiosAPI({
				url: '/test/a',
				method: 'GET',
			})
				.then((response) => {
					console.log('check response: ', response);
				})
				.catch((err) => {
					console.log('err: ', err);
					window.alert(
						'The test server has been shut down. Please use the production page below. \n https://talkdocu.com',
					);
					window.location.href = 'https://www.talkdocu.com';
				});
		}
	}, []);
	return (
		<ThemeProvider theme={lightTheme}>
			<CssBaseline />
			<Provider store={store}>
				<Component {...pageProps} />
			</Provider>
		</ThemeProvider>
	);
}
