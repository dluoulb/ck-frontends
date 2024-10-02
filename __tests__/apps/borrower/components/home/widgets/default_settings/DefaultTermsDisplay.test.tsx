import { usePathname } from 'next/navigation';

import DefaultTermsDisplay from '@apps/borrower/components/home/widgets/default_settings/DefaultTermsDisplay';
import { customRender, screen } from '@lib/testing/test-utils';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

describe('Default Terms Display Component', () => {
  (usePathname as jest.Mock).mockReturnValue('/borrower');

  test('renders', async () => {
    customRender(<DefaultTermsDisplay />, { withBorrowerProviders: true });

    expect(
      screen.getByRole('default-term-display-component', { hidden: true })
    ).toBeInTheDocument();
  });

  test('does NOT display', async () => {
    global.mockedUseDefaultTerms.mockImplementation(() => ({
      defaultTerms: [],
      defaultTermsLoading: false,
    }));
    customRender(<DefaultTermsDisplay />, { withBorrowerProviders: true });

    expect(
      screen.queryByRole('default-term-display-component', { hidden: true })
    ).toBeNull();
  });
});
