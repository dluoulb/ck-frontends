import Session from 'supertokens-auth-react/recipe/session';

export function getApiDomain() {
  return (
    process.env.NEXT_PUBLIC_SUPERTOKENS_API_DOMAIN || 'http://localhost:54320'
  );
}

export function getApiBasePath() {
  return process.env.NEXT_PUBLIC_SUPERTOKENS_API_BASEPATH || '/';
}

export function getWebsiteDomain() {
  return (
    process.env.NEXT_PUBLIC_SUPERTOKENS_WEBSITE_DOMAIN ||
    'http://localhost:54321'
  );
}

export function getWebsiteBasePath() {
  return process.env.NEXT_PUBLIC_SUPERTOKENS_WEBSITE_BASEPATH || '/';
}

export function getCookieDomain() {
  return process.env.NEXT_PUBLIC_SUPERTOKENS_COOKIE_DOMAIN || 'localhost';
}

export const SuperTokensConfig = {
  appInfo: {
    appName: 'Credit Key Admin',
    apiDomain: getApiDomain(),
    apiBasePath: getApiBasePath(),
    websiteDomain: getWebsiteDomain(),
    websiteBasePath: getWebsiteBasePath(),
  },
  recipeList: [
    Session.init({
      sessionTokenBackendDomain: getCookieDomain(),
      sessionTokenFrontendDomain: getCookieDomain(),
      override: {
        functions: (oI) => {
          // When we init/use SuperTokens it globally intercepts our api/fetch
          // requests and injects it's own headers etc.
          //
          // This creates issues (CORS etc) when we want to call other backends
          // (Rails etc) that aren't part of our auth layer scope.
          //
          // Normally, we would have to hack our api calls and add various overides
          // like (`credentials: 'omit'`).
          //
          // REF: https://supertokens.com/docs/thirdparty/common-customizations/sessions/disable-interception
          return {
            ...oI,
            shouldDoInterceptionBasedOnUrl: (
              url,
              apiDomain,
              sessionTokenBackendDomain
            ) => {
              try {
                let urlObj = new URL(url);

                // Only intercept when calling our auth server api
                if (urlObj.origin !== getApiDomain()) {
                  return false;
                }
              } catch (_) {}
              return oI.shouldDoInterceptionBasedOnUrl(
                url,
                apiDomain,
                sessionTokenBackendDomain
              );
            },
          };
        },
      },
    }),
  ],
};
