
import DefaultSettings from '@apps/borrower/components/home/widgets/default_settings/DefaultSettings';
import { customRender, screen } from '@lib/testing/test-utils';

describe('Default Settings Widget', () => {
  test('displays payment method data', async () => {
    customRender(<DefaultSettings />, { withBorrowerProviders: true });

    expect(screen.getByText(/My Big Bank/i));
  });

  test('displays default terms data', async () => {
    customRender(<DefaultSettings />, { withBorrowerProviders: true });

    expect(screen.getByRole('default-term-display-component'));
  });
});
