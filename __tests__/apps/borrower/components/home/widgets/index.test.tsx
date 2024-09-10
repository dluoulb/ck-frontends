import Widgets from '@apps/borrower/components/home/widgets';
import { companyApproved } from '@lib/testing/records';
import { customRender, screen } from '@lib/testing/test-utils';

describe('Widgets Index', () => {
  test('renders all widgets', async () => {
    customRender(<Widgets />, {
      withBorrowerProviders: true,
      user: companyApproved.borrower,
      fetchConfig: { orders: true },
    });

    const widgets = screen.getAllByRole('base-grid-item-component');
    expect(widgets).toHaveLength(4);
  });
});
