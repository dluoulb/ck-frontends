const path = require('path');

const isDeployedBuild = process.env.DEPLOY_TARGET && process.env.DEPLOY_TARGET != "";
const baseURL = isDeployedBuild ? '%%%NEXT_PUBLIC_BASE_URL%%%' : process.env.NEXT_PUBLIC_BASE_URL;

module.exports = {
  publicRuntimeConfig: {
    baseURL: baseURL || 'http://localhost:3000',
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias['@components'] = path.join(
      __dirname,
      'shared/components'
    );
    config.resolve.alias['@contexts'] = path.join(__dirname, 'shared/contexts');
    config.resolve.alias['@hooks'] = path.join(__dirname, 'shared/hooks');
    config.resolve.alias['@lib'] = path.join(__dirname, 'shared/lib');
    config.resolve.alias['@records'] = path.join(
      __dirname,
      'shared/lib/records'
    );
    config.resolve.alias['@apps/reports'] = path.join(
      __dirname,
      'apps/reports'
    );
    config.resolve.alias['@apps/borrower'] = path.join(
      __dirname,
      'apps/borrower'
    );

    return config;
  },
  async rewrites() {
    return {
      fallback: [
        {
          source: '/_healthcheck',
          destination: '/api/_healthcheck',
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
      ]
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
    ]
  },
  isDeployedBuild: isDeployedBuild,
  // This is lets us inject these variables from the env that exists at runtime so we don't have to bake our secrets into the image
  ...(isDeployedBuild && {
    env: {
      APP_VERSION: process.env.APP_VERSION,
      "NEXT_PUBLIC_ACCEPT_BLUE_SOURCE": "%%%NEXT_PUBLIC_ACCEPT_BLUE_SOURCE%%%",
      "NEXT_PUBLIC_ACCEPT_BLUE_TOKEN": "%%%NEXT_PUBLIC_ACCEPT_BLUE_TOKEN%%%",
      "NEXT_PUBLIC_API_URL": "%%%NEXT_PUBLIC_API_URL%%%",
      "NEXT_PUBLIC_BASE_URL": "%%%NEXT_PUBLIC_BASE_URL%%%",
      "NEXT_PUBLIC_CK_WEB_VIRTUAL_HOST": "%%%NEXT_PUBLIC_CK_WEB_VIRTUAL_HOST%%%",
      "NEXT_PUBLIC_CMS_BASE_URL": "%%%NEXT_PUBLIC_CMS_BASE_URL%%%",
      "NEXT_PUBLIC_ENV": "%%%NEXT_PUBLIC_ENV%%%",
      "NEXT_PUBLIC_APP_ENV": "%%%NEXT_PUBLIC_APP_ENV%%%",
      "NEXT_PUBLIC_STRAPI_API_TOKEN": "%%%NEXT_PUBLIC_STRAPI_API_TOKEN%%%",
      "NEXT_PUBLIC_SUPERTOKENS_API_BASEPATH": "%%%NEXT_PUBLIC_SUPERTOKENS_API_BASEPATH%%%",
      "NEXT_PUBLIC_SUPERTOKENS_API_DOMAIN": "%%%NEXT_PUBLIC_SUPERTOKENS_API_DOMAIN%%%",
      "NEXT_PUBLIC_SUPERTOKENS_COOKIE_DOMAIN": "%%%NEXT_PUBLIC_SUPERTOKENS_COOKIE_DOMAIN%%%",
      "NEXT_PUBLIC_SUPERTOKENS_WEBSITE_BASEPATH": "%%%NEXT_PUBLIC_SUPERTOKENS_WEBSITE_BASEPATH%%%",
      "NEXT_PUBLIC_SUPERTOKENS_WEBSITE_DOMAIN": "%%%NEXT_PUBLIC_SUPERTOKENS_WEBSITE_DOMAIN%%%",
      "NEXT_PUBLIC_TYPESENSE_PORT": "%%%NEXT_PUBLIC_TYPESENSE_PORT%%%",
      "NEXT_PUBLIC_TYPESENSE_PROTOCOL": "%%%NEXT_PUBLIC_TYPESENSE_PROTOCOL%%%",
      "NEXT_PUBLIC_TYPESENSE_SERVER": "%%%NEXT_PUBLIC_TYPESENSE_SERVER%%%",
      "NEXT_PUBLIC_VC_MERCHANT_KEY": "%%%NEXT_PUBLIC_VC_MERCHANT_KEY%%%",
      "NEXT_PUBLIC_VC_MERCHANT_SECRET": "%%%NEXT_PUBLIC_VC_MERCHANT_SECRET%%%",
      "NEXT_PUBLIC_VIRTUAL_CARD_MERCHANT_ID": "%%%NEXT_PUBLIC_VIRTUAL_CARD_MERCHANT_ID%%%",
      "NEXT_PUBLIC_ROLLBAR_TOKEN": "%%%NEXT_PUBLIC_ROLLBAR_TOKEN%%%",
      "NEXT_PUBLIC_FULLSTORY_ORG_ID": "%%%NEXT_PUBLIC_FULLSTORY_ORG_ID%%%",
      "NEXT_PUBLIC_PLAID_CREATE_PMS": "%%%NEXT_PUBLIC_PLAID_CREATE_PMS%%%"
    }
  }),
  output: 'standalone'
};
