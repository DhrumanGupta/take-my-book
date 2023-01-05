/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images-na.ssl-images-amazon.com", "m.media-amazon.com"],
  },
};

module.exports = nextConfig;
