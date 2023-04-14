import { LOGIN, LOGOUT } from './index';
export function login({
	isLoggedIn,
	userData,
}: {
	isLoggedIn: boolean;
	userData: any;
}) {
	console.log('login action called ');
	console.log('is logged in : ', isLoggedIn);
	console.log('user data:', userData);
	return {
		type: LOGIN,
		payload: {
			isLoggedIn,
			userData,
		},
	};
}
export function logout() {
	console.log('logout action called : ');
	return {
		type: LOGOUT,
		payload: {
			isLoggedIn: false,
			userData: null,
		},
	};
}
