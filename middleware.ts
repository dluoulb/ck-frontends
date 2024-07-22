import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!api|_next|robots.txt|fonts|examples|.*/img).*)'],
};

const sites = [
  { domain: 'reports.localhost', shortname: 'reports' },
  { domain: 'admin.localhost', shortname: 'admin' },
  { domain: 'borrower.localhost', shortname: 'borrower' },
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

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const site = siteForHost(req.headers.get('host'));

  if (['/login', '/login-token'].includes(pathname)) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    return NextResponse.redirect(
      new URL(
        site
          ? `${process.env.NEXTAUTH_URL}/login?from=${site.shortname}`
          : `${process.env.NEXTAUTH_URL}/login`,
        req.url
      )
    );
  }

  if (site) {
    return NextResponse.rewrite(
      new URL(`/${site?.shortname}${pathname}`, req.url)
    );
  }
}
