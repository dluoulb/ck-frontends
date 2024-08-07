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
  const sessionToken = req.cookies.get('st-access-token');

  if (!sessionToken) {
    return NextResponse.redirect(
      new URL(
        `${process.env.NEXT_PUBLIC_SUPERTOKENS_WEBSITE_DOMAIN}/?r=${process.env.NEXT_PUBLIC_BASE_URL}${site ? `/${site.shortname}` : pathname}`
      )
    );
  }

  if (site) {
    return NextResponse.rewrite(
      new URL(`/${site?.shortname}${pathname}`, req.url)
    );
  }
}
