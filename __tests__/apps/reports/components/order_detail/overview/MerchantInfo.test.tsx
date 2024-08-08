import '@testing-library/jest-dom';

import MerchantInfo from '@apps/reports/components/order_detail/overview/MerchantInfo';
import { orderA, tpsLoan1 } from '@lib/testing/records';
import { renders } from '@lib/testing/test-utils';

describe('MerchantInfo Component', () => {
  let props = { order: orderA, product: tpsLoan1 };
  renders(MerchantInfo, props);
});
