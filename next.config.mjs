/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/',
        destination: '/html/index.html',
      },
    ];
  },
};

export default nextConfig;
