import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const config = {
  matcher: ["/((?!api|_next|robots.txt|fonts|examples|.*/img).*)"],
};

const sites = [
  {
    domain: "reports.localhost",
    shortname: "reports",
  },
  {
    domain: "admin.localhost",
    shortname: "admin",
  },
  {
    domain: "borrower.localhost",
    shortname: "borrower",
  },
];

function siteForHost(host) {
  if (host.includes("creditkey.com")) {
    const shortname = host.split(".")[0];
    const matchingSite = sites.find((site) => site.shortname === shortname);
    return matchingSite ? matchingSite : null;
  } else {
    const domain = host.replace(/(local|new)\./, "").replace(":3000", "");
    const matchingSite = sites.find((site) => site.domain === domain);
    return matchingSite ? matchingSite : null;
  }
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const site = siteForHost(req.headers.get("host")!);

  if (["/login", "/login-token"].includes(pathname)) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token && site) {
    ////////////// BUG FOR DEV //////////////
    // Based on this Github issue, it appears in dev routes are going
    // to relative path instead of defined absolute path
    // https://github.com/vercel/next.js/issues/44482
    return NextResponse.redirect(
      new URL(
        `${process.env.NEXTAUTH_URL}/login?from=${site?.shortname}`,
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
