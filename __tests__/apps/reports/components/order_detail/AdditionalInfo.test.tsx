import { render, screen } from '@testing-library/react';

import AdditionalInfo from '@apps/reports/components/order_detail/AdditionalInfo';
import { companyApproved, orderA, tpsLoan2 } from '@lib/testing/records';

describe('Additional Info Component', () => {
  let props = { product: tpsLoan2, order: orderA, entity: companyApproved };
  test('renders and checks days late function', () => {
    render(<AdditionalInfo {...props} />);

    const daysLate = screen.getByText(/days late:/i).closest('p');
    expect(daysLate).toHaveTextContent('18');

    expect(screen.getByText('shipping address:'));
  });
});
