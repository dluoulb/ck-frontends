import SingleUseVirtualCard from '@apps/borrower/components/home/widgets/virtual_cards/SingleUseVirtualCard';
import { companyAmazonExclusive, companyApproved } from '@lib/testing/records';
import { customRender, screen } from '@lib/testing/test-utils';

jest.mock('@contexts/BorrowerContext', () => ({
  ...jest.requireActual('@contexts/BorrowerContext'),
  useBorrowerDeps: jest.fn().mockReturnValue({
    orders: [
      {
        transaction_type: 'virtual_card',
        virtual_card_details: {
          number: '4111111111111234',
          cvv: '123',
          expiration: '12/26',
        },
        id: 'order-1',
        status: 'active',
        attributes: {},
      },
    ],
    ordersError: null,
    ordersLoading: false,
  }),
}));

jest.mock('next/image', () => {
  const MockImage = (props) => <img {...props} />;
  MockImage.displayName = 'MockImage';
  return MockImage;
});

describe('SingleUseVirtualCard', () => {
  test('shows CKA link for non-Amazon users with active cards', () => {
    global.mockedUseEntity.mockImplementation(() => ({
      entity: companyApproved,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    }));

    customRender(<SingleUseVirtualCard />, { withBorrowerProviders: true });

    expect(screen.getByText('Learn more')).toBeInTheDocument();
  });

  test('hides CKA link for Amazon Exclusive users with active cards', () => {
    global.mockedUseEntity.mockImplementation(() => ({
      entity: companyAmazonExclusive,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    }));

    customRender(<SingleUseVirtualCard />, { withBorrowerProviders: true });

    expect(screen.queryByText('Learn more')).not.toBeInTheDocument();
  });

  test('hides CKA link while entity is loading', () => {
    global.mockedUseEntity.mockImplementation(() => ({
      entity: null,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: true,
    }));

    customRender(<SingleUseVirtualCard />, { withBorrowerProviders: true });

    expect(screen.queryByText('Learn more')).not.toBeInTheDocument();
  });
});
