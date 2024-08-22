import '@testing-library/jest-dom';

import { BaseGrid, BaseGridItem } from '@components/BaseGrid';
import { renders } from '@lib/testing/test-utils';

describe('BaseGrid Component', () => {
  renders(BaseGrid);
  renders(BaseGridItem);
});
