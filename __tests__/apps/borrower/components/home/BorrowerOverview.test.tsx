import { customRender, screen } from '@lib/testing/test-utils';

import BorrowerOverview from '@apps/borrower/components/home/BorrowerOverview';
import { companyApproved } from '@lib/testing/records';

describe('Borrower Overview Component', () => {
  test('renders', () => {
    customRender(<BorrowerOverview />, {
      withBorrowerProviders: true,
      user: companyApproved.borrower,
    });

    expect(screen.getByRole('status'));
  });
});
