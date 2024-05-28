import Session from 'supertokens-auth-react/recipe/session';

export function getApiDomain() {
  return (
    process.env.NEXT_PUBLIC_SUPERTOKENS_API_DOMAIN || 'http://localhost:54320'
  );
}

export function getWebsiteDomain() {
  return (
    process.env.NEXT_PUBLIC_SUPERTOKENS_WEBSITE_DOMAIN || 'http://localhost:54321'
  );
}

export function getWebsiteBasePath() {
  return process.env.NEXT_PUBLIC_SUPERTOKENS_WEBSITE_BASEPATH || '/';
}

const SuperTokensConfig = {
  appInfo: {
    appName: 'Credit Key Admin',
    apiDomain: getApiDomain(),
    websiteDomain: getWebsiteDomain(),
    websiteBasePath: getWebsiteBasePath(),
  },
  recipeList: [Session.init()],
};

export default SuperTokensConfig;
