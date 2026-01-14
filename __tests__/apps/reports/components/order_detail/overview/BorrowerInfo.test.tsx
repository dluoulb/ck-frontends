import '@testing-library/jest-dom';

import BorrowerInfo from '@apps/reports/components/order_detail/overview/BorrowerInfo';
import { companyApproved, orderA } from '@lib/testing/records';
import { renders } from '@lib/testing/test-utils';

describe('BorrowerInfo Component', () => {
  const props = { order: orderA, entity: companyApproved };
  renders(BorrowerInfo, props);
});
