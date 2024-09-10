import DefaultTermsDisplay from '@apps/borrower/components/home/widgets/default_settings/DefaultTermsDisplay';
import { companyApproved } from '@lib/testing/records';
import { customRender, screen } from '@lib/testing/test-utils';

describe('Default Terms Display Component', () => {
  test('renders', async () => {
    customRender(<DefaultTermsDisplay />, {
      withBorrowerProviders: true,
      user: companyApproved.borrower,
      fetchConfig: {
        default_terms: true,
      },
    });

    expect(
      screen.getByRole('default-term-display-component', { hidden: true })
    ).toBeInTheDocument();
  });

  test('does NOT display', async () => {
    global.mockedUseDefaultTerms.mockImplementation(() => ({
      defaultTerms: [],
      defaultTermsLoading: false,
    }));
    customRender(<DefaultTermsDisplay />, {
      withBorrowerProviders: true,
      user: companyApproved.borrower,
      fetchConfig: {
        default_terms: true,
      },
    });

    expect(
      screen.queryByRole('default-term-display-component', { hidden: true })
    ).toBeNull();
  });
});
