import VirtualCard from '@apps/borrower/components/home/widgets/virtual_cards/VirtualCard';
import useOrders from '@hooks/useOrders';
import { companyApproved } from '@lib/testing/records';
import { customRender, screen } from '@lib/testing/test-utils';

jest.mock('@hooks/useOrders', () => jest.fn());
const mockedUseOrders = useOrders as jest.MockedFunction<typeof useOrders>;

describe('Virtual Card Widget Component', () => {
  test('displays VCs if entity has VC orders', async () => {
    customRender(<VirtualCard />, {
      withBorrowerProviders: true,
      user: companyApproved.borrower,
      fetchConfig: { orders: true },
    });

    expect(screen.getByText('x1234'));
    expect(screen.getByText('Request New Card'));
  });

  test('displays VC info widget if entity DOES NOT have VC orders', async () => {
    mockedUseOrders.mockImplementation(() => ({
      orders: [],
      ordersLoading: false,
      isFetching: false,
      ordersError: null,
      pageCount: 1,
    }));

    customRender(<VirtualCard />, {
      withBorrowerProviders: true,
      user: companyApproved.borrower,
      fetchConfig: { orders: true },
    });

    expect(screen.getByText(/Request a virtual card/));
    expect(screen.getByText('Learn More'));
  });

  test('displays loading', async () => {
    global.mockedUseOrders.mockImplementation(() => ({
      orders: [],
      ordersLoading: true,
      isFetching: false,
      ordersError: null,
      pageCount: 1,
    }));

    customRender(<VirtualCard />, {
      withBorrowerProviders: true,
      user: companyApproved.borrower,
      fetchConfig: { orders: true },
    });

    expect(screen.getByRole('loading'));
  });
});
