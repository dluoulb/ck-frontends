import '@testing-library/jest-dom';

import TransactionsTable from '@apps/reports/components/order_detail/transactions_table/TransactionsTable';
import { tpsLoan1 } from '@lib/testing/records';
import { render, renders, screen } from '@lib/testing/test-utils';

describe('TransactionsTable Component', () => {
  let props = { transactions: tpsLoan1.transactions, err: null };
  renders(TransactionsTable, props);

  test('display loading if no transactions', () => {
    let props = { transactions: null, err: null };
    render(<TransactionsTable {...props} />);

    expect(screen.getByRole('loading')).toBeInTheDocument();
  });

  test('displays no transactions if empty', () => {
    let props = { transactions: [], err: null };
    render(<TransactionsTable {...props} />);

    expect(screen.getByText('No transactions found.')).toBeInTheDocument();
  });
});
