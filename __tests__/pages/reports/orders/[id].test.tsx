import { usePathname } from 'next/navigation';

import useOrderDependencies from '@apps/reports/hooks/useOrderDependencies';
import { getOrder } from '@lib/actions/orders';
import { companyApproved, orderA, tpsLoan1, user } from '@lib/testing/records';
import { customRender, screen, waitFor } from '@lib/testing/test-utils';
import OrderIndex from '@pages/reports/orders/[id]';

jest.mock('@lib/actions/orders', () => ({
  getOrder: jest.fn(),
}));

jest.mock('@apps/reports/hooks/useOrderDependencies');

describe('Order Detail Page', () => {
  test('displays error page when order not fetched', async () => {
    (getOrder as jest.Mock).mockImplementation(() => {
      return Promise.reject(new Error('Order not found'));
    });

    (useOrderDependencies as jest.Mock).mockReturnValue({
      orderDeps: {
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

    await waitFor(() => {
      expect(screen.getByText('No Order found')).toBeInTheDocument();
    });
  });

  test('fetches and displays order data', async () => {
    (getOrder as jest.Mock).mockResolvedValue(orderA);

    (usePathname as jest.Mock).mockReturnValue('/reports/orders/CK-123456');

    (useOrderDependencies as jest.Mock).mockReturnValue({
      orderDeps: {
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

    await waitFor(() => {
      expect(screen.getByRole('order-index-component')).toBeInTheDocument();
    });
  });
});
