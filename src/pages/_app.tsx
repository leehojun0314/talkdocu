import '@/common/styles/globals.css';
import { lightTheme } from '@/common/theme/customTheme';
import { CssBaseline, ThemeProvider } from '@mui/material';
import type { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import store from '@/redux/store';
export default function App({ Component, pageProps }: AppProps) {
	return (
		<ThemeProvider theme={lightTheme}>
			<CssBaseline />
			<Provider store={store}>
				<Component {...pageProps} />
			</Provider>
		</ThemeProvider>
	);
}
