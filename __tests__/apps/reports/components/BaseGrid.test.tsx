import '@testing-library/jest-dom';

import { BaseGrid, BaseGridItem } from '@apps/reports/components/BaseGrid';
import { renders } from '@lib/testing/test-utils';

describe('BaseGrid Component', () => {
  renders(BaseGrid);
  renders(BaseGridItem);
});
