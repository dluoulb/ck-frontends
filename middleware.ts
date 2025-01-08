import { NextRequest, NextResponse } from 'next/server';

import { authRedirectLink, routes } from '@lib/constants/SiteVariables';

export const config = {
  matcher: ['/((?!api|_next|robots.txt|fonts|examples|.*/img).*)'],
};

const sites = [
  { domain: 'reports.creditkey.localhost', shortname: 'reports' },
  { domain: 'admin.creditkey.localhost', shortname: 'admin' },
  { domain: 'borrower.creditkey.localhost', shortname: 'borrower' },
];

function siteForHost(host) {
  if (host.includes('creditkey.com')) {
    const shortname = host.split('.')[0];
    const matchingSite = sites.find((site) => site.shortname === shortname);
    return matchingSite ? matchingSite : null;
  } else {
    const domain = host.replace(/(local|new)\./, '').replace(':3000', '');
    return sites.find((site) => site.domain === domain) || null;
  }
}

function parseUserJwt(token) {
  if (!token) return null;

  const base64Url = token?.value?.split('.')[1];
  const base64 = base64Url.replace('-', '+').replace('_', '/');
  const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');
  const jwt = JSON.parse(jsonPayload);

  return {
    userID: jwt.sub,
    isImpersonating: jwt.isImpersonating,
    parentID: jwt.parentUserId,
    role: jwt['st-role']?.v,
  };
}

export default async function middleware(req: NextRequest) {
  const { pathname, protocol } = req.nextUrl;
  const host = req.headers.get('host');
  const site = siteForHost(req.headers.get('host'));
  const currentRoute = routes.find((route) => {
    return site?.shortname
      ? route.href.includes(site?.shortname)
      : route.href === pathname;
  });

  const sessionToken = req.cookies.get('st-access-token');
  const parsedToken = parseUserJwt(sessionToken);

  if (!sessionToken) {
    return NextResponse.redirect(
      new URL(authRedirectLink(`${protocol}//${host}${pathname}`))
    );
  }

  // If a user is trying to access a route that is not approved for their user type
  const userRouteAccessNotAllowed =
    currentRoute &&
    !parsedToken?.role.some((role) =>
      currentRoute.approvedRoles.includes(role)
    );

  // If either above condition is true route them to unauthorized
  if (userRouteAccessNotAllowed) {
    const newUrl = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/unauthorized`);
    return NextResponse.redirect(newUrl);
  }

  if (!site) {
    return NextResponse.next();
  }

  // Avoid rewriting the path if it's already correctly prefixed with the site shortname
  if (pathname.startsWith(`/${site.shortname}`)) {
    return NextResponse.next();
  }

  // Rewrite the URL to include the site shortname if it's missing
  const newPathname = `/${site.shortname}${pathname}`;
  const newUrl = new URL(`${req.nextUrl.origin}${newPathname}`);

  return NextResponse.rewrite(newUrl);
}
