import DefaultTermsDisplay from '@apps/borrower/components/home/widgets/default_settings/DefaultTermsDisplay';
import { customRender, screen } from '@lib/testing/test-utils';

describe('Default Terms Display Component', () => {
  test('renders', async () => {
    customRender(<DefaultTermsDisplay />, { withBorrowerProviders: true });

    expect(
      screen.getByRole('default-term-display-component', { hidden: true })
    ).toBeInTheDocument();
  });

  test('does NOT display', async () => {
    global.mockedUseDefaultTerms.mockImplementation(() => ({
      defaultTermSettings: [],
      defaultTermsLoading: false,
    }));
    customRender(<DefaultTermsDisplay />, { withBorrowerProviders: true });

    expect(
      screen.queryByRole('default-term-display-component', { hidden: true })
    ).toBeNull();
  });
});
