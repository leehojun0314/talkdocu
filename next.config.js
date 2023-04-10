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
};

module.exports = nextConfig;
