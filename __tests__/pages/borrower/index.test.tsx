import { useQuery } from '@tanstack/react-query';

import useBorrowerDependencies from '@apps/borrower/hooks/useBorrowerDependencies';
import SideNav from '@components/layout/SideNav';
import useOrders from '@hooks/useOrders';
import {
  companyApproved,
  orderA,
  orderB,
  paymentMethodBank1,
  paymentMethodCard1,
  stats,
} from '@lib/testing/records';
import { act, customRender, screen } from '@lib/testing/test-utils';
import BorrowerIndex from '@pages/borrower/index';

jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: jest.fn(),
}));

jest.mock('@hooks/useOrders');
jest.mock('@apps/borrower/hooks/useBorrowerDependencies');

// Mock the useQuery calls within useBorrowerDependencies
(useQuery as jest.Mock).mockImplementation((options) => {
  if (options.queryKey[0] === 'company') {
    return {
      data: { attributes: companyApproved },
      error: null,
      isLoading: false,
    };
  } else if (options.queryKey[0] === 'stats') {
    return { data: stats, error: null, isLoading: false };
  } else if (options.queryKey[0] === 'payment_methods') {
    return {
      data: { data: [paymentMethodBank1] },
      error: null,
      isLoading: false,
    };
  }

  return { data: null, error: null, isLoading: false };
});

describe('Borrower Portal Home Page', () => {
  test('displays portal layout', async () => {
    const primaryRoutes = [
      { name: 'Home', url: '/borrower' },
      { name: 'Orders', url: '/borrower/orders' },
      { name: 'Help Center', url: '/support' },
    ];

    customRender(<SideNav primaryRoutes={primaryRoutes} />);

    act(() => {
      // check if Sidenav has loaded
      expect(screen.getByText('Help Center'));
    });
  });

  test('displays main dashboard', async () => {
    (useOrders as jest.Mock).mockReturnValue({
      orders: [orderA, orderB],
      ordersLoading: false,
      ordersError: null,
      pageCount: 1,
      fetchData: jest.fn(),
    });

    (useBorrowerDependencies as jest.Mock).mockReturnValue({
      userProps: {
        type: companyApproved.type,
        entity: companyApproved,
        stats: stats,
        paymentMethods: [paymentMethodBank1, paymentMethodCard1],
        defaultTerms: {},
        errors: {},
        isLoading: false,
      },
    });

    customRender(<BorrowerIndex />);

    act(() => {
      // check if dashboard has loaded
      expect(screen.getByText('Borrower Dashboard'));
    });
  });
});
