import MerchantCard from '@apps/borrower/components/rewards/MerchantCard';
import { customRender, screen } from '@lib/testing/test-utils';

jest.mock('@lib/actions/marketplace', () => ({
  marketplace: {
    url: 'https://marketplace.test.com',
    enabled: true,
  },
}));

jest.mock('next/image', () => {
  const MockImage = ({ alt = '', unoptimized: _unoptimized, ...props }) => (
    <img alt={alt} {...props} />
  );
  MockImage.displayName = 'MockImage';
  return MockImage;
});

describe('MerchantCard', () => {
  test('renders merchant details and marketplace link', () => {
    customRender(
      <MerchantCard
        merchant={{
          id: 'merchant-1',
          name: 'Acme Supplies',
          description: 'A test merchant description',
          logoUrl: 'https://cdn.test/logo.png',
          cashbackLabel: '5% cash back',
          plusBonusLabel: '3% Plus Bonus',
          slug: 'acme-supplies',
        }}
      />,
    );

    expect(screen.getByText('Acme Supplies')).toBeInTheDocument();
    expect(screen.getByText('5% cash back')).toBeInTheDocument();
    expect(screen.getByText('3% Plus Bonus')).toBeInTheDocument();
    expect(screen.getByText('A test merchant description')).toBeInTheDocument();

    const link = screen.getByTestId('reward-merchant-card');
    expect(link).toHaveAttribute('href', 'https://marketplace.test.com/merchants/acme-supplies');
  });

  test('renders initials fallback when merchant logo is unavailable', () => {
    customRender(
      <MerchantCard
        merchant={{
          id: 'merchant-2',
          name: 'Sam Club',
          description: 'Merchant without a logo',
          logoUrl: null,
          cashbackLabel: '$3.25 cash back',
          plusBonusLabel: '1% Plus Bonus',
          marketplaceUrl: 'https://merchant.test.com',
        }}
      />,
    );

    expect(screen.getByText('SC')).toBeInTheDocument();
    expect(screen.getByText('$3.25 cash back')).toBeInTheDocument();
    expect(screen.getByText('1% Plus Bonus')).toBeInTheDocument();
  });

  test('falls back to slug-based URL when marketplaceUrl has an unsafe scheme', () => {
    customRender(
      <MerchantCard
        merchant={{
          id: 'merchant-4',
          name: 'Unsafe Merchant',
          logoUrl: null,
          cashbackLabel: '2% cash back',
          slug: 'unsafe-merchant',
          marketplaceUrl: 'javascript:alert(1)',
        }}
      />,
    );

    const link = screen.getByTestId('reward-merchant-card');
    expect(link).toHaveAttribute('href', 'https://marketplace.test.com/merchants/unsafe-merchant');
  });

  test('uses marketplaceUrl directly when provided', () => {
    customRender(
      <MerchantCard
        merchant={{
          id: 'merchant-5',
          name: 'Tracked Merchant',
          logoUrl: null,
          cashbackLabel: '2% cash back',
          marketplaceUrl: 'https://merchant.test.com?c=164321',
        }}
      />,
    );

    const link = screen.getByTestId('reward-merchant-card');
    expect(link).toHaveAttribute('href', 'https://merchant.test.com?c=164321');
  });

  test('renders the provided plus bonus label for integrated merchants', () => {
    customRender(
      <MerchantCard
        merchant={{
          id: 'merchant-3',
          name: 'Samsung',
          description: 'Electronics supplier',
          logoUrl: null,
          cashbackLabel: '1.3% cash back',
          plusBonusLabel: '0.03% Plus Bonus',
          marketplaceUrl: 'https://merchant.test.com',
        }}
      />,
    );

    expect(screen.getByText('0.03% Plus Bonus')).toBeInTheDocument();
  });
});
