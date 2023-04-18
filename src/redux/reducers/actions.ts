import { CHANGE_CONV, LOGIN, LOGOUT } from './index';
export function login({
	isLoggedIn,
	userData,
}: {
	isLoggedIn: boolean;
	userData: any;
}) {
	return {
		type: LOGIN,
		payload: {
			isLoggedIn,
			userData,
		},
	};
}
export function logout() {
	return {
		type: LOGOUT,
		payload: {
			isLoggedIn: false,
			userData: null,
		},
	};
}
export function changeConv(last_conv: number) {
	return {
		type: CHANGE_CONV,
		payload: {
			last_conv: last_conv,
		},
	};
}
