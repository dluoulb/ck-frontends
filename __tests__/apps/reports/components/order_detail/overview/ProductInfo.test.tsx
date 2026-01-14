import '@testing-library/jest-dom';

import ProductInfo from '@apps/reports/components/order_detail/overview/ProductInfo';
import { orderA, tpsLoan1 } from '@lib/testing/records';
import { renders } from '@lib/testing/test-utils';

describe('ProductInfo Component', () => {
  const props = { order: orderA, product: tpsLoan1 };
  renders(ProductInfo, props);
});
