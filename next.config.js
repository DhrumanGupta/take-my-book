/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "images-na.ssl-images-amazon.com",
      "m.media-amazon.com",
      `${process.env.BUCKET_NAME}.s3.amazonaws.com`,
    ],
  },
};

module.exports = nextConfig;
