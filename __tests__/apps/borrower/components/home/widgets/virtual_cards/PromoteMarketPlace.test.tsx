import PromoteMarketplace from '@apps/borrower/components/home/widgets/virtual_cards/PromoteMarketPlace';
import { companyAmazonExclusive } from '@lib/testing/records';
import { customRender, screen } from '@lib/testing/test-utils';

describe('PromoteMarketplace', () => {
  test('renders marketplace link for non-Amazon users', () => {
    customRender(<PromoteMarketplace />);

    expect(screen.getByText(/Enter the Marketplace/)).toBeInTheDocument();
  });

  test('returns null for Amazon Exclusive users', () => {
    global.mockedUseEntity.mockImplementation(() => ({
      entity: companyAmazonExclusive,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    }));

    const { container } = customRender(<PromoteMarketplace />);

    expect(container.innerHTML).toBe('');
  });
});
