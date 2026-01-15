import VirtualCard from '@apps/borrower/components/home/widgets/virtual_cards/VirtualCard';
import useActiveOrders from '@hooks/useActiveOrders';
import { customRender, screen } from '@lib/testing/test-utils';

jest.mock('@hooks/useActiveOrders', () => jest.fn());

const mockedUseActiveOrders = useActiveOrders as jest.MockedFunction<typeof useActiveOrders>;

const mockVirtualCardOrder = {
  id: 'vc-order-1',
  order_key: 'VC-123456',
  transaction_type: 'virtual_card',
  amount: '100.00',
  created_at: '2024-01-01T00:00:00Z',
  virtual_card_details: {
    number: '1234567890121234',
    cvv: '123',
    expiration_month: '12',
    expiration_year: '2025',
  },
  merchant: {
    name: 'Test Merchant',
  },
};

describe('Virtual Card Widget Component', () => {
  test('displays VCs if entity has VC orders', async () => {
    const mockOrders = [mockVirtualCardOrder];

    mockedUseActiveOrders.mockReturnValue({
      orders: mockOrders,
      ordersLoading: false,
      ordersError: null,
      isFetching: false,
      pageCount: 1,
      totalOrderCount: 1,
      refetchOrders: jest.fn(),
    });

    customRender(<VirtualCard bannerName="virtual_card" />, { withBorrowerProviders: true });

    // Check that the active virtual cards section is displayed
    expect(await screen.findByText('Active Virtual Cards')).toBeInTheDocument();
    // Check that the VCList component is rendered
    expect(screen.getByRole('virtual-card-list-component')).toBeInTheDocument();
    // Check that Request New Card button is present
    expect(screen.getByText('Request New Card')).toBeInTheDocument();
  });

  test('displays VC info widget if entity DOES NOT have VC orders', async () => {
    mockedUseActiveOrders.mockReturnValue({
      orders: [],
      ordersLoading: false,
      ordersError: null,
      isFetching: false,
      pageCount: 1,
      totalOrderCount: 0,
      refetchOrders: jest.fn(),
    });

    customRender(<VirtualCard bannerName="virtual_card" />, { withBorrowerProviders: true });

    expect(screen.getByText(/Create My Virtual Card/)).toBeInTheDocument();
    expect(screen.getByText('Learn More')).toBeInTheDocument();
  });

  test('displays loading', async () => {
    mockedUseActiveOrders.mockReturnValue({
      orders: [],
      ordersLoading: true,
      ordersError: null,
      isFetching: false,
      pageCount: 1,
      totalOrderCount: 0,
      refetchOrders: jest.fn(),
    });

    customRender(<VirtualCard bannerName="virtual_card" />, { withBorrowerProviders: true });

    expect(screen.getByRole('loading')).toBeInTheDocument();
  });
});
