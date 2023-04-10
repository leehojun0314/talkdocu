import axios from 'axios';
import type { AxiosProgressEvent } from 'axios';
export enum axiosMethod {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	DELETE = 'DELETE',
}
interface axiosAPIParams {
	method: axiosMethod;
	url: string;
	data?: any;
	onDownloadProgress?: (params: AxiosProgressEvent) => void;
}

export default function axiosAPI(params: axiosAPIParams) {
	return axios({
		url: process.env.API_ENDPOINT + params.url,
		method: params.method,
		data: params.data,
		headers: {
			Authorization: `Bearer ${localStorage.getItem('user_token')}`,
		},
		onDownloadProgress: params.onDownloadProgress,
	});
}
