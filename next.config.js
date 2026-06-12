module.exports = {
  allowedDevOrigins: ['*.creditkey.localhost'],
  turbopack: {},
  async rewrites() {
    const marketplaceRewrites = process.env.NEXT_PUBLIC_MARKET_API_URL
      ? [
          {
            source: '/marketplace/:path*',
            destination: `${process.env.NEXT_PUBLIC_MARKET_API_URL}/:path*`,
          },
        ]
      : [];

    return {
      beforeFiles: marketplaceRewrites,
      fallback: [
        {
          source: '/_healthcheck',
          destination: '/api/_healthcheck',
        },
        {
          source: '/_next/:path*',
          destination: '/_next/:path*',
        },
        {
          source: '/__nextjs/:path*',
          destination: '/__nextjs/:path*',
        },
        {
          source: '/reports/:path*',
          destination: '/reports/:path*',
        },
        {
          source: '/admin/:path*',
          destination: '/admin/:path*',
        },
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: '(?<borrower>.*)\\..*',
            },
          ],
          destination: '/borrower/:path*',
        },
      ],
    };
  },
  async redirects() {
    return [
      {
        source: '/login',
        has: [
          {
            type: 'host',
            value: '(?<borrower>.*)\\..*',
          },
        ],
        destination: '/',
        permanent: true,
      },
      {
        source: '/borrower',
        has: [
          {
            type: 'host',
            value: '(?<borrower>.*)\\..*',
          },
        ],
        destination: '/',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/.well-known/apple-app-site-association',
        headers: [{ key: 'Content-Type', value: 'application/json' }],
      },
    ];
  },
  env: {
    APP_VERSION: process.env.APP_VERSION,
  },
  output: 'standalone',
};
