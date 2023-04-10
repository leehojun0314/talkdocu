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
		GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
	},
};

module.exports = nextConfig;
