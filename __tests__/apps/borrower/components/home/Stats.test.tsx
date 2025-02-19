import Stats from '@apps/borrower/components/home/Stats';
import { customRender, screen, waitFor } from '@lib/testing/test-utils';

describe('Stats Component', () => {
  test('renders', async () => {
    customRender(<Stats />, { withBorrowerProviders: true });

    await waitFor(() => {
      const remainingLabel = screen.getByText(/Remaining Credit/i);
      const remainingValue = remainingLabel.parentElement.querySelector('dd');
      expect(remainingValue).toHaveTextContent('$6,080.00');
    });
  });
  test('displays error notification if stats not fetched', async () => {
    global.mockedUseStats.mockImplementation(() => ({
      stats: [],
      statsError: new Error('Stats not Found'),
      statsLoading: false,
    }));
    customRender(<Stats />, { withBorrowerProviders: true });

    expect(screen.getByText(/Unable to collect available company credit/));
  });
});
