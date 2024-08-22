const path = require('path');

module.exports = {
  publicRuntimeConfig: {
    baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias['@components'] = path.join(__dirname, 'shared/components');
    config.resolve.alias['@contexts'] = path.join(__dirname, 'shared/contexts');
    config.resolve.alias['@hooks'] = path.join(__dirname, 'shared/hooks');
    config.resolve.alias['@lib'] = path.join(__dirname, 'shared/lib');
    config.resolve.alias['@records'] = path.join(__dirname, 'shared/lib/records');
    config.resolve.alias['@apps/reports'] = path.join(__dirname, 'apps/reports');
    config.resolve.alias['@apps/borrower'] = path.join(__dirname, 'apps/borrower');

    return config;
  },
};
