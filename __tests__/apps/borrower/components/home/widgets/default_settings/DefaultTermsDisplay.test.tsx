import DefaultTermsDisplay from '@apps/borrower/components/home/widgets/default_settings/DefaultTermsDisplay';
import { companyApproved, defaultTerms } from '@lib/testing/records';
import { customRender, screen } from '@lib/testing/test-utils';

describe('Default Terms Display Component', () => {
  test('does NOT display', async () => {
    customRender(<DefaultTermsDisplay entity={companyApproved} />);

    expect(screen.queryByRole('default-term-display-component', { hidden: true })).toBeNull();
  });

  test('renders', async () => {
    customRender(<DefaultTermsDisplay entity={companyApproved} defaultTerms={defaultTerms} />);

    expect(screen.getByRole('default-term-display-component', { hidden: true })).toBeInTheDocument();
  });
});
