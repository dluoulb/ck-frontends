import { customRender, screen, waitFor } from '@lib/testing/test-utils';
import BorrowerIndex from '@pages/borrower/index';

describe('Borrower Portal Home Page', () => {
  test('displays main dashboard', async () => {
    customRender(<BorrowerIndex />, { withBorrowerProviders: true });

    // Wait for the dashboard to load and check for company name
    await waitFor(() => {
      expect(screen.getByText('Widget Maker Co.')).toBeInTheDocument();
    });

    // Check that widgets are rendered
    const widgets = screen.getAllByRole('base-grid-item-component');
    expect(widgets.length).toBeGreaterThan(0);
  });
});
