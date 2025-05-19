import Widgets from '@apps/borrower/components/home/widgets';
import { customRender, screen } from '@lib/testing/test-utils';

describe('Widgets Index', () => {
  test('renders all widgets', async () => {
    customRender(<Widgets />, { withBorrowerProviders: true });

    const widgets = screen.getAllByRole('base-grid-item-component');
    expect(widgets).toHaveLength(3);
  });
});
