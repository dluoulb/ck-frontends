import BorrowerOverview from '@apps/borrower/components/home/BorrowerOverview';
import { customRender, screen } from '@lib/testing/test-utils';

describe('Borrower Overview Component', () => {
  test('renders', () => {
    customRender(<BorrowerOverview />, { withBorrowerProviders: true });

    expect(screen.getByRole('status'));
  });
});
