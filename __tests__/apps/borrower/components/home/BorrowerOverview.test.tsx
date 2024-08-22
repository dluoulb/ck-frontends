import { render, screen } from '@testing-library/react';

import BorrowerOverview from '@apps/borrower/components/home/BorrowerOverview';
import { companyApproved } from '@lib/testing/records';

describe('Borrower Overview Component', () => {
  test('renders', () => {
    render(
      <BorrowerOverview entity={companyApproved} type={companyApproved.type} />
    );

    expect(screen.getByRole('status'));
  });
});
