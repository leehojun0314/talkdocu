import axios from 'axios';
import type { AxiosProgressEvent } from 'axios';
import getConfig from 'next/config';
const { API_ENDPOINT } = getConfig().publicRuntimeConfig;
interface axiosAPIParams {
	method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'UPDATE';
	url: string;
	data?: any;
	onDownloadProgress?: (params: AxiosProgressEvent) => void;
}

export default function axiosAPI(params: axiosAPIParams) {
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
