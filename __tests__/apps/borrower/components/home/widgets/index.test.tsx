import { usePathname } from 'next/navigation';

import Widgets from '@apps/borrower/components/home/widgets';
import { customRender, screen } from '@lib/testing/test-utils';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('Widgets Index', () => {
  (usePathname as jest.Mock).mockReturnValue('/borrower');

  test('renders all widgets', async () => {
    customRender(<Widgets />, { withBorrowerProviders: true });

    const widgets = screen.getAllByRole('base-grid-item-component');
    expect(widgets).toHaveLength(4);
  });
});
