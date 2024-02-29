/** @type {import('next').NextConfig} */
const nextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/',
        destination: '/html/index.html',
      },
      {
        source: '/solutions',
        destination: '/html/solutions.html',
      },
      {
        source: '/price',
        destination: '/html/price.html',
      },
      {
        source: '/company',
        destination: '/html/company.html',
      },
      {
        source: '/resources',
        destination: '/html/resources.html',
      },
      {
        source: '/contact',
        destination: '/html/contact.html',
      },
    ];
  },
};

export default nextConfig;
