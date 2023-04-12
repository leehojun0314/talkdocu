import axios from 'axios';
import type { AxiosProgressEvent } from 'axios';
import { error } from 'console';
import getConfig from 'next/config';
const { API_ENDPOINT } = getConfig().publicRuntimeConfig;
interface axiosAPIParams {
	method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'UPDATE';
	url: string;
	data?: any;
	onDownloadProgress?: (params: AxiosProgressEvent) => void;
}

export default function axiosAPI(params: axiosAPIParams) {
	axios.interceptors.response.use(
		(response) => response,
		(error) => {
			console.log('error in interceptors : ', error.response);
			if (error.response.status === 401) {
				window.alert('로그인이 필요한 서비스입니다.');
				window.location.href = '/login';
			}
		},
	);
	return axios({
		url: API_ENDPOINT + params.url,
		method: params.method,
		data: params.data,
		headers: {
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
		withCredentials: true,
		onDownloadProgress: params.onDownloadProgress,
	});
}
