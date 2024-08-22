import Widgets from '@apps/borrower/components/home/widgets';
import useOrders from '@hooks/useOrders';
import {
  companyApproved,
  orderA,
  orderB,
  paymentMethodBank1,
} from '@lib/testing/records';
import { customRender, screen, waitFor } from '@lib/testing/test-utils';

jest.mock('@hooks/useOrders');

describe('Widgets Index', () => {
  test('renders all widgets', async () => {
    (useOrders as jest.Mock).mockReturnValue({
      orders: [orderA, orderB],
      ordersLoading: false,
      ordersError: null,
      pageCount: 1,
      fetchData: jest.fn(),
    });
    customRender(
      <Widgets
        entity={companyApproved}
        paymentMethods={[paymentMethodBank1]}
        defaultTerms={[]}
      />
    );

    const widgets = screen.getAllByRole('base-grid-item-component');
    expect(widgets).toHaveLength(4);
  });
});
