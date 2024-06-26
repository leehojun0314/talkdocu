export function extractToken(cookieString: string | null) {
	if (!cookieString) {
		return null;
	}
	// console.log('cookie string: ', cookieString);
	const cookies = cookieString.split('; '); // 세미콜론과 공백으로 분리
	for (let i = 0; i < cookies.length; i++) {
		const [key, value] = cookies[i].split('='); // 각 쿠키를 키와 값으로 분리

		if (key.includes('next-auth.session-token')) {
			return value.replace(' ', ''); // 원하는 키를 찾으면 값을 반환
		}
	}
	return null; // 해당 키가 없으면 null 반환
}
