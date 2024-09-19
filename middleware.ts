import { NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/((?!api|_next|robots.txt|fonts|examples|.*/img).*)'],
};

const sites = [
  { domain: 'reports.creditkey.localhost', shortname: 'reports' },
  { domain: 'admin.creditkey.localhost', shortname: 'admin' },
  { domain: 'borrower.creditkey.localhost', shortname: 'borrower' },
];

function siteForHost(host) {
  const matchingSite = sites.find((site) => host.includes(site.shortname));
  return matchingSite ? matchingSite : null;
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const site = siteForHost(req.headers.get('host'));

  if (!site) {
    return NextResponse.next();
  }

  const sessionToken = req.cookies.get('st-access-token');

  if (!sessionToken) {
    return NextResponse.redirect(
      new URL(
        `${process.env.NEXT_PUBLIC_SUPERTOKENS_WEBSITE_DOMAIN}/?r=${process.env.NEXT_PUBLIC_BASE_URL}${site ? `/${site.shortname}` : pathname}`
      )
    );
  }

  const newPathname = pathname.startsWith(`/${site.shortname}`)
    ? pathname
    : `/${site.shortname}${pathname}`;

  const newUrl = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}${newPathname}`);

  return NextResponse.rewrite(newUrl);
}
