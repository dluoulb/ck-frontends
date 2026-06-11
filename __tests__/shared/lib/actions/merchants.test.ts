import { getTopCashbackMerchants } from '@lib/actions/merchants';
import { addAuthorization } from '@lib/utils/authorization';

jest.mock('@lib/actions/marketplace', () => ({
  marketplace: {
    url: 'https://marketplace.test.com',
    apiUrl: 'https://market-api.test.com',
    enabled: true,
  },
}));

jest.mock('@lib/utils/authorization', () => ({
  addAuthorization: jest.fn(),
}));

const mockAddAuthorization = addAuthorization as jest.MockedFunction<typeof addAuthorization>;

describe('getTopCashbackMerchants', () => {
  test('requests marketplace merchants with auth and normalizes result', async () => {
    const api = { get: jest.fn() };
    mockAddAuthorization.mockResolvedValue({
      headers: { Authorization: '******' },
    } as any);
    api.get.mockResolvedValue({
      data: {
        data: [
          {
            id: 'm1',
            attributes: {
              name: 'Merchant One',
              logo_url: 'https://cdn.test/m1.png',
              cashback_percentage: 6.5,
              slug: 'merchant-one',
            },
          },
        ],
      },
    });

    const merchants = await getTopCashbackMerchants(api as any);

    expect(api.get).toHaveBeenCalledWith('/marketplace/merchants/top_cashback', {
      headers: { Authorization: '******' },
    });
    expect(merchants).toEqual([
      {
        id: 'm1',
        name: 'Merchant One',
        logoUrl: 'https://cdn.test/m1.png',
        description: undefined,
        cashbackLabel: '6.5% cash back',
        plusBonusLabel: undefined,
        slug: 'merchant-one',
        marketplaceUrl: undefined,
      },
    ]);
  });

  test('normalizes current marketplace payload shape', async () => {
    const api = { get: jest.fn() };
    mockAddAuthorization.mockResolvedValue({
      headers: { Authorization: '******' },
    } as any);
    api.get.mockResolvedValue({
      data: [
        {
          id: 11,
          name: 'Chery Industrial',
          slug: 'chery-industrial',
          url: 'https://wild.link/e?c=164321',
          logoUrl: null,
          affiliateRateKind: 'PERCENTAGE',
          affiliateRateAmount: '9.75',
          plusBonusRate: 0.03,
        },
        {
          id: 142,
          name: 'Faire',
          slug: 'faire',
          url: 'https://www.faire.com',
          logoUrl: null,
          affiliateRateKind: 'FLAT',
          affiliateRateAmount: '3.25',
          plusBonusRate: 0.01,
        },
      ],
    });

    const merchants = await getTopCashbackMerchants(api as any);

    expect(merchants).toEqual([
      {
        id: '11',
        name: 'Chery Industrial',
        description: undefined,
        logoUrl: null,
        cashbackLabel: '9.75% cash back',
        plusBonusLabel: '0.03% Plus Bonus',
        slug: 'chery-industrial',
        marketplaceUrl: 'https://wild.link/e?c=164321',
      },
      {
        id: '142',
        name: 'Faire',
        description: undefined,
        logoUrl: null,
        cashbackLabel: '$3.25 cash back',
        plusBonusLabel: '0.01% Plus Bonus',
        slug: 'faire',
        marketplaceUrl: 'https://www.faire.com',
      },
    ]);
  });

  test('keeps merchants without cashback amount', async () => {
    const api = { get: jest.fn() };
    mockAddAuthorization.mockResolvedValue({
      headers: { Authorization: '******' },
    } as any);
    api.get.mockResolvedValue({
      data: [
        {
          id: 163,
          name: 'Alibaba',
          slug: 'alibaba',
          description: 'Global marketplace',
          url: 'https://alibaba.com',
          logoUrl: null,
          affiliateRateAmount: null,
          plusBonusRate: 0.01,
        },
      ],
    });

    const merchants = await getTopCashbackMerchants(api as any);

    expect(merchants).toEqual([
      {
        id: '163',
        name: 'Alibaba',
        description: 'Global marketplace',
        logoUrl: null,
        cashbackLabel: undefined,
        plusBonusLabel: '0.01% Plus Bonus',
        slug: 'alibaba',
        marketplaceUrl: 'https://alibaba.com',
      },
    ]);
  });

  test('decodes escaped unicode in merchant text fields', async () => {
    const api = { get: jest.fn() };
    mockAddAuthorization.mockResolvedValue({
      headers: { Authorization: '******' },
    } as any);
    api.get.mockResolvedValue({
      data: [
        {
          id: 43,
          name: 'Chef\\u2019s Deal',
          slug: 'chefs-deal',
          description:
            'Chef\\u2019s Deal offers restaurant equipment and kitchen supplies at the best prices.',
          url: 'https://merchant.test.com',
          logoUrl: null,
          affiliateRateAmount: '1.3',
          plusBonusRate: 0.03,
        },
      ],
    });

    const merchants = await getTopCashbackMerchants(api as any);

    expect(merchants).toEqual([
      {
        id: '43',
        name: 'Chef’s Deal',
        description:
          'Chef’s Deal offers restaurant equipment and kitchen supplies at the best prices.',
        logoUrl: null,
        cashbackLabel: '1.3% cash back',
        plusBonusLabel: '0.03% Plus Bonus',
        slug: 'chefs-deal',
        marketplaceUrl: 'https://merchant.test.com',
      },
    ]);
  });
});
