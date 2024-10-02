import { usePathname } from 'next/navigation';

import VirtualCard from '@apps/borrower/components/home/widgets/virtual_cards/VirtualCard';
import useOrders from '@hooks/useOrders';
import { customRender, screen } from '@lib/testing/test-utils';

jest.mock('@hooks/useOrders', () => jest.fn());
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));
const mockedUseOrders = useOrders as jest.MockedFunction<typeof useOrders>;

describe('Virtual Card Widget Component', () => {
  test('displays VCs if entity has VC orders', async () => {
    (usePathname as jest.Mock).mockReturnValue('/borrower');
    customRender(<VirtualCard />, { withBorrowerProviders: true });

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
      totalOrderCount: 0,
    }));

    customRender(<VirtualCard />, { withBorrowerProviders: true });

    expect(screen.getByText(/Request a virtual card/));
    expect(screen.getByText('Learn More'));
  });

  test('displays loading', async () => {
    (usePathname as jest.Mock).mockReturnValue('/borrower');

    global.mockedUseOrders.mockImplementation(() => ({
      orders: [],
      ordersLoading: true,
      isFetching: false,
      ordersError: null,
      pageCount: 1,
      totalOrderCount: 0,
    }));

    customRender(<VirtualCard />, { withBorrowerProviders: true });

    expect(screen.getByRole('loading'));
  });
});
