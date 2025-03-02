import { withSentryConfig } from '@sentry/nextjs';

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // next.js ---
      {
        source: '/bm/signin',
        destination: '/signin',
        permanent: false,
      },
      {
        source: '/en/signin',
        destination: '/signin',
        permanent: false,
      },
      {
        source: '/bm/signup',
        destination: '/signup',
        permanent: false,
      },
      {
        source: '/en/signup',
        destination: '/signup',
        permanent: false,
      },
      {
        source: '/bm/docs',
        destination: '/docs',
        permanent: false,
      },
      {
        source: '/en/docs',
        destination: '/docs',
        permanent: false,
      },
      // --- next.js
    ];
  },
  rewrites: async () => {
    return [
      {
        source: '/',
        destination: '/html/locale/en/index.html',
      },
      {
        source: '/bm',
        destination: '/html/locale/bm/index.html',
      },
      {
        source: '/company',
        destination: '/html/locale/en/company.html',
      },
      {
        source: '/bm/company',
        destination: '/html/locale/bm/company.html',
      },
      {
        source: '/contact',
        destination: '/html/locale/en/contact.html',
      },
      {
        source: '/bm/contact',
        destination: '/html/locale/bm/contact.html',
      },
      {
        source: '/policy',
        destination: '/html/locale/en/policy.html',
      },
      {
        source: '/bm/policy',
        destination: '/html/locale/bm/policy.html',
      },
      {
        source: '/price',
        destination: '/html/locale/en/price.html',
      },
      {
        source: '/bm/price',
        destination: '/html/locale/bm/price.html',
      },
      {
        source: '/resources',
        destination: '/html/locale/en/resources.html',
      },
      {
        source: '/bm/resources',
        destination: '/html/locale/bm/resources.html',
      },
      {
        source: '/bm/solutions',
        destination: '/html/locale/bm/solutions.html',
      },
      {
        source: '/solutions',
        destination: '/html/locale/en/solutions.html',
      },
      {
        source: '/price',
        destination: '/html/locale/en/price.html',
      },
      {
        source: '/bm/price',
        destination: '/html/locale/bm/price.html',
      },
      {
        source: '/bm/company',
        destination: '/html/locale/bm/company.html',
      },
      {
        source: '/company',
        destination: '/html/locale/en/company.html',
      },
      {
        source: '/resources',
        destination: '/html/locale/en/resources.html',
      },
      {
        source: '/bm/resources',
        destination: '/html/locale/bm/resources.html',
      },
      {
        source: '/contact',
        destination: '/html/locale/en/contact.html',
      },
      {
        source: '/bm/contact',
        destination: '/html/locale/bm/contact.html',
      },
      {
        source: '/policy',
        destination: '/html/locale/en/policy.html',
      },
      {
        source: '/bm/policy',
        destination: '/html/locale/bm/policy.html',
      },
      {
        source: '/wasiat',
        destination: '/html/locale/en/wasiat.html',
      },
      {
        source: '/bm/wasiat',
        destination: '/html/locale/bm/wasiat.html',
      },
      {
        source: '/sampul_trust',
        destination: '/html/locale/en/sampul_trust.html',
      },
      {
        source: '/bm/sampul_trust',
        destination: '/html/locale/bm/sampul_trust.html',
      },
      {
        source: '/sampul_executor',
        destination: '/html/locale/en/sampul_executor.html',
      },
      {
        source: '/bm/sampul_executor',
        destination: '/html/locale/bm/sampul_executor.html',
      },
    ];
  },
  reactStrictMode: true,
};

export default withSentryConfig(
  nextConfig,
  {
    // For all available options, see:
    // https://github.com/getsentry/sentry-webpack-plugin#options

    // Suppresses source map uploading logs during build
    silent: true,
    org: 'sampul',
    project: 'javascript-nextjs',
  },
  {
    // For all available options, see:
    // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

    // Upload a larger set of source maps for prettier stack traces (increases build time)
    widenClientFileUpload: true,

    // Transpiles SDK to be compatible with IE11 (increases bundle size)
    transpileClientSDK: true,

    // Routes browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers. (increases server load)
    // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
    // side errors will fail.
    tunnelRoute: '/monitoring',

    // Hides source maps from generated client bundles
    hideSourceMaps: true,

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    disableLogger: true,

    // Enables automatic instrumentation of Vercel Cron Monitors.
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  }
);
