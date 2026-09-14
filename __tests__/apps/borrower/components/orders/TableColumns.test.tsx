import { TableColumns } from '@apps/borrower/components/orders/TableColumns';
import { customRender, screen } from '@lib/testing/test-utils';

describe('TableColumns', () => {
  test('displays Pay In Full for a non-editable Pay Now order', () => {
    const payNowOrder = {
      product_type: 'pay_now',
      terms_editable: false,
      product: { installments: 6 },
    };
    const termsColumn = TableColumns(jest.fn()).find((column) => column.id === 'terms');

    customRender(termsColumn.cell({ getValue: jest.fn(), row: { original: payNowOrder } }));

    expect(screen.getByText('Pay In Full')).toBeInTheDocument();
  });
});
