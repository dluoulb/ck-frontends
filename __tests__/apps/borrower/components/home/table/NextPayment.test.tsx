import NextPayment from '@apps/borrower/components/home/table/NextPayment';
import { customRender, screen } from '@lib/testing/test-utils';

const makeOrder = (productType = 'pay_now', status = 'created') => ({
  product_type: productType,
  product: {
    status,
  },
});

describe('NextPayment', () => {
  test.each(['created', 'pending'])(
    'shows no payment due without an unscheduled date for Pay Now %s orders',
    (status) => {
      customRender(<NextPayment order={makeOrder('pay_now', status)} />);

      expect(screen.getByText('No Payment Due')).toBeInTheDocument();
      expect(screen.queryByText('Not Yet Scheduled')).not.toBeInTheDocument();
    },
  );

  test.each(['created', 'pending'])(
    'shows an unscheduled date for non-Pay-Now %s orders',
    (status) => {
      customRender(<NextPayment order={makeOrder('payment_plan', status)} />);

      expect(screen.getByText('Not Yet Scheduled')).toBeInTheDocument();
    },
  );
});
