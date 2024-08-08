import { screen } from '@testing-library/react';

import OrderOverview from '@apps/reports/components/order_detail/OrderOverview';
import { adminUser, orderA, tpsLoan1, user } from '@lib/testing/records';
import { customRender } from '@lib/testing/test-utils';

describe('Order Overview Component', () => {
  test('renders', () => {
    customRender(<OrderOverview order={orderA} product={tpsLoan1} />, {
      userContext: { user, setUser: jest.fn() },
    });

    expect(screen.getByText('Merchant Order ID: TEST1234'));
  });

  test('displays checkout link', () => {
    customRender(<OrderOverview order={orderA} product={tpsLoan1} />, {
      userContext: { user: adminUser, setUser: jest.fn() },
    });

    expect(screen.getByText('Checkout Session URL'));
  });
});
