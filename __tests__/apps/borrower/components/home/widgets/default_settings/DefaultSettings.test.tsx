import DefaultSettings from '@apps/borrower/components/home/widgets/default_settings/DefaultSettings';
import usePaymentMethods from '@apps/borrower/hooks/usePaymentMethods';
import {
  companyApproved,
  defaultTerms,
  paymentMethodBank1,
  paymentMethodCard1,
} from '@lib/testing/records';
import { customRender, screen } from '@lib/testing/test-utils';

jest.mock('@apps/borrower/hooks/usePaymentMethods');

describe('Default Settings Widget', () => {
  test('displays payment method data', async () => {
    (usePaymentMethods as jest.Mock).mockReturnValue({
      activePaymentMethods: [paymentMethodBank1, paymentMethodCard1],
      defaultBankLabel: paymentMethodBank1.label,
      defaultCardLabel: paymentMethodCard1.label,
      defaultCard: paymentMethodCard1,
      defaultBank: paymentMethodBank1,
    });

    customRender(
      <DefaultSettings
        entity={companyApproved}
        paymentMethods={[paymentMethodBank1, paymentMethodCard1]}
        defaultTerms={defaultTerms}
      />
    );

    expect(screen.getByText('My Big Bank ******7890'));
  });

  test('displays default terms data', async () => {
    (usePaymentMethods as jest.Mock).mockReturnValue({
      activePaymentMethods: [paymentMethodBank1, paymentMethodCard1],
      defaultBankLabel: paymentMethodBank1.label,
      defaultCardLabel: paymentMethodCard1.label,
      defaultCard: paymentMethodCard1,
      defaultBank: paymentMethodBank1,
    });

    customRender(
      <DefaultSettings
        entity={companyApproved}
        paymentMethods={[paymentMethodBank1, paymentMethodCard1]}
        defaultTerms={defaultTerms}
      />
    );

    expect(screen.getByRole('default-term-display-component'));
  });
});
