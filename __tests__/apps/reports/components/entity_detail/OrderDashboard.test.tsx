import 'regenerator-runtime/runtime';

import OrderDashboard from '@apps/reports/components/entity_detail/OrderDashboard';
import useOrders from '@hooks/useOrders';
import { companyApproved, orderA, orderB } from '@lib/testing/records';
import { renders } from '@lib/testing/test-utils';

jest.mock('@hooks/useOrders');

describe('Order Dashboard Component', () => {
  let props = {
    type: 'company',
    entity: companyApproved,
  };
  (useOrders as jest.Mock).mockReturnValue({
    orders: [orderA, orderB],
    ordersLoading: false,
    ordersError: null,
    pageCount: 1,
    fetchData: jest.fn(),
  });
  renders(OrderDashboard, props);
});
