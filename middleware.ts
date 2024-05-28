import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/((?!api|_next|robots.txt|fonts|examples|.*/img).*)"],
};

const sites = [
  {
    domain: "reports.localhost",
    shortname: "reports",
    redirects: false,
  },
  {
    domain: "admin.localhost",
    shortname: "admin",
    redirects: false,
  },
  {
    domain: "borrower.localhost",
    shortname: "borrower",
    redirects: false,
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

export default function middleware(req: NextRequest) {
  const site = siteForHost(req.headers.get("host")!);

  let pathname = req.nextUrl.pathname;

  if (pathname.includes("/components") || pathname.includes("/layout")) {
    return NextResponse.rewrite(new URL("/404", req.url));
  }

  if (site && site.redirects && site.redirects[pathname]) {
    return NextResponse.redirect(new URL(site.redirects[pathname], req.url));
  }

  if (site) {
    return NextResponse.rewrite(
      new URL(`/${site.shortname}${pathname}`, req.url)
    );
  }
}
