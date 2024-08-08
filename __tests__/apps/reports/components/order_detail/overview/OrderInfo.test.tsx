import '@testing-library/jest-dom';

import OrderInfo from '@apps/reports/components/order_detail/overview/OrderInfo';
import { orderA, tpsLoan1 } from '@lib/testing/records';
import { renders } from '@lib/testing/test-utils';

describe('OrderInfo Component', () => {
  let props = { order: orderA, product: tpsLoan1 };
  renders(OrderInfo, props);
});
