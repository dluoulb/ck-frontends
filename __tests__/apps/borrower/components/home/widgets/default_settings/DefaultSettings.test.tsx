import { usePathname } from 'next/navigation';

import DefaultSettings from '@apps/borrower/components/home/widgets/default_settings/DefaultSettings';
import { customRender, screen } from '@lib/testing/test-utils';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('Default Settings Widget', () => {
  (usePathname as jest.Mock).mockReturnValue('/borrower');

  test('displays payment method data', async () => {
    customRender(<DefaultSettings />, { withBorrowerProviders: true });

    expect(screen.getByText(/My Big Bank/i));
  });

  test('displays default terms data', async () => {
    customRender(<DefaultSettings />, { withBorrowerProviders: true });

    expect(screen.getByRole('default-term-display-component'));
  });
});
