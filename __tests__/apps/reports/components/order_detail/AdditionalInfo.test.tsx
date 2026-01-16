import { render, screen } from '@testing-library/react';

import AdditionalInfo from '@apps/reports/components/order_detail/AdditionalInfo';
import { companyApproved, orderA, tpsLoan2 } from '@lib/testing/records';

describe('Additional Info Component', () => {
  const props = { product: tpsLoan2, order: orderA, entity: companyApproved };
  test('renders and checks amount refunded function', () => {
    render(<AdditionalInfo {...props} />);

    const daysLate = screen.getByText(/amount refunded:/i).closest('p');
    expect(daysLate).toHaveTextContent('$11.00');

    expect(screen.getByText('shipping address:'));
  });
});
