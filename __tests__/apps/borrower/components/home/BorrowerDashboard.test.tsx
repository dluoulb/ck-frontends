import { useQuery } from '@tanstack/react-query';

import BorrowerDashboard from '@apps/borrower/components/home/BorrowerDashboard';
import useBorrowerDependencies from '@apps/borrower/hooks/useBorrowerDependencies';
import useOrders from '@hooks/useOrders';
import {
  companyApproved,
  orderA,
  orderB,
  paymentMethodBank1,
  paymentMethodCard1,
  stats,
} from '@lib/testing/records';
import { customRender, screen, waitFor } from '@lib/testing/test-utils';

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

describe('Main Dashbboard Home Page', () => {
  test('displays error page when entity not fetched', async () => {
    (useBorrowerDependencies as jest.Mock).mockReturnValue({
      userProps: {
        type: 'company',
        entity: null,
        ownerAddress: null,
        applications: [],
        stats: null,
        documents: [],
        errors: { entityError: new Error('Entity not found') },
        hasErrors: false,
        isLoading: false,
      },
    });

    customRender(<BorrowerDashboard />);

    expect(screen.getByText('No company found'));
  });

  test('renders all dashboard widgets', async () => {
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

    customRender(<BorrowerDashboard />);

    // check if borrower overview has loaded
    await waitFor(() => expect(screen.getByText('Widget Maker Co.')));

    const widgets = screen.getAllByRole('base-grid-item-component');
    expect(widgets).toHaveLength(7);
  });
});
