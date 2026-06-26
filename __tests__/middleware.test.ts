/** @jest-environment node */

import type { NextRequest } from 'next/server';

import middleware from '../middleware';

describe('middleware', () => {
  const originalSuperTokensWebsiteDomain = process.env.NEXT_PUBLIC_SUPERTOKENS_WEBSITE_DOMAIN;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPERTOKENS_WEBSITE_DOMAIN = 'https://login.creditkey.com';
  });

  afterEach(() => {
    if (originalSuperTokensWebsiteDomain === undefined) {
      delete process.env.NEXT_PUBLIC_SUPERTOKENS_WEBSITE_DOMAIN;
      return;
    }

    process.env.NEXT_PUBLIC_SUPERTOKENS_WEBSITE_DOMAIN = originalSuperTokensWebsiteDomain;
  });

  it('preserves multi-param borrower deep links without leaking top-level login params', async () => {
    const request = {
      nextUrl: new URL(
        'https://borrower.creditkey.localhost/?request_credit_increase=true&source=email',
      ),
      headers: new Headers({ host: 'borrower.creditkey.localhost' }),
      cookies: { get: () => undefined },
    } as NextRequest;

    const response = await middleware(request);
    const location = new URL(response.headers.get('location')!);

    expect(location.searchParams.get('r')).toBe(
      'https://borrower.creditkey.localhost/?request_credit_increase=true&source=email',
    );
    expect(location.searchParams.get('request_credit_increase')).toBeNull();
    expect(location.searchParams.get('source')).toBeNull();
  });
});
