import '@testing-library/jest-dom';

import { tpsLoan1 } from '@lib/testing/records';
import { render, renders, screen } from '@lib/testing/test-utils';
import PSTable from '@apps/reports/components/order_detail/payment_schedule/PSTable';

describe('PSTable Component', () => {
  let props = { payment_schedule: tpsLoan1.payment_schedule, err: null };
  renders(PSTable, props);

  test('display loading if no payment schedule yet', () => {
    let props = { payment_schedule: null, err: null };
    render(<PSTable {...props} />);

    expect(screen.getByRole('loading')).toBeInTheDocument();
  });

  test('displays no payment schedule if empty', () => {
    let props = { payment_schedule: [], err: null };
    render(<PSTable {...props} />);

    expect(screen.getByText('No payment schedule found.')).toBeInTheDocument();
  });
});
