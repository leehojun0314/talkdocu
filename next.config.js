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
		ADSENSE_CLIENT: process.env.ADSENSE_CLIENT,
		ADSENSE_SLOT: process.env.ADSENSE_SLOT,
		NODE_ENV_CLI: process.env.NODE_ENV_CLI,
	},
};

module.exports = nextConfig;
