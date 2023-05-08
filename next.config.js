/** @type {import('next').NextConfig} */
const nextConfig = {
	// reactStrictMode: true,
	// compiler: {
	//   emotion: {
	//     sourceMap: true,
	//     autoLabel: "dev-only",
	//     labelFormat: "[dirname]-[filename]-[local]",
	//   },
	// },
	images: {
		unoptimized: true,
	},
	trailingSlash: true,
	publicRuntimeConfig: {
		API_ENDPOINT: process.env.API_ENDPOINT,
		GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
		KAKAO_CLIENT_ID: process.env.KAKAO_CLIENT_ID,
		NAVER_CLIENT_ID: process.env.NAVER_CLIENT_ID,
		APPLE_CLIENT_ID: process.env.APPLE_CLIENT_ID,
		FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
	},
};

module.exports = nextConfig;
