import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import useOrderDependencies from '@apps/reports/hooks/useOrderDependencies';
import { companyApproved, orderA, tpsLoan1, user } from '@lib/testing/records';
import { customRender, screen, waitFor } from '@lib/testing/test-utils';
import OrderIndex from '@pages/reports/orders/[id]';

jest.mock('@lib/actions/entities', () => ({
  getOrder: jest.fn(),
}));

jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: jest.fn(),
}));

jest.mock('@apps/reports/hooks/useOrderDependencies');

// Mock the useQuery calls within useOrderDependencies
(useQuery as jest.Mock).mockImplementation((options) => {
  if (options.queryKey[0] === 'entity') {
    return {
      data: { attributes: companyApproved },
      error: null,
      isLoading: false,
    };
  } else if (options.queryKey[0] === 'transactions') {
    return {
      data: tpsLoan1.transactions,
      error: null,
      isLoading: false,
    };
  } else if (options.queryKey[0] === 'payment_schedule') {
    return { data: tpsLoan1.payment_schedule, error: null, isLoading: false };
  }
  return { data: null, error: null, isLoading: false };
});

describe('Order Detail Page', () => {
  test('displays error page when order not fetched', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: undefined,
      error: new Error('Order not found'),
      isLoading: false,
    });

    (useOrderDependencies as jest.Mock).mockReturnValue({
      orderProps: {
        type: 'company',
        entity: null,
        transactions: [],
        paymentSchedule: [],
        errors: {},
        hasErrors: false,
        isLoading: false,
      },
    });

    customRender(<OrderIndex />, { routerQuery: { id: 'invalid-id' } });

    expect(screen.getByText('No Order found'));
  });

  test('fetches and displays order data', async () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: orderA,
      error: null,
      isLoading: false,
    });

    (usePathname as jest.Mock).mockReturnValue('/reports/orders/CK-123456');

    // Mock the useEntityDependencies hook to return the desired props
    (useOrderDependencies as jest.Mock).mockReturnValue({
      orderProps: {
        type: companyApproved.type,
        entity: companyApproved,
        transactions: tpsLoan1.transactions,
        paymentSchedule: tpsLoan1.payment_schedule,
        errors: {},
        hasErrors: false,
        isLoading: false,
      },
    });

    customRender(<OrderIndex />, {
      user: user,
      routerQuery: { id: orderA.id },
    });

    await waitFor(() => screen.getByRole('order-index-component'));
  });
});
