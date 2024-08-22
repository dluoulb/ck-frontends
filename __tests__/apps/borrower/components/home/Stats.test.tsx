import { useQuery } from '@tanstack/react-query';

import BorrowerDashboard from '@apps/borrower/components/home/BorrowerDashboard';
import Stats from '@apps/borrower/components/home/Stats';
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

describe('Stats Component', () => {
  test('displays error notification if stats not fetched', async () => {
    customRender(
      <Stats
        entity={companyApproved}
        stats={stats}
        errors={{ statsError: new Error('Stats not Found') }}
      />
    );

    expect(screen.getByText(/Unable to collect available company credit/));
  });

  test('renders', async () => {
    customRender(
      <Stats entity={companyApproved} stats={stats} errors={null} />
    );

    await waitFor(() => {
      const remainingLabel = screen.getByText(/Remaining Credit/i);
      const remainingValue = remainingLabel.parentElement.querySelector('dd');
      expect(remainingValue).toHaveTextContent('$6,080.00');
    });
  });
});
