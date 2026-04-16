import React from 'react';

import MultiUseVirtualCardModalWrapper from '@apps/borrower/components/home/widgets/virtual_cards/vc_modal/MultiUseVirtualCardModalWrapper';
import useCompanyPhysicalCard from '@apps/borrower/hooks/useCompanyPhysicalCard';
import useCompanyVirtualCard from '@apps/borrower/hooks/useCompanyVirtualCard';
import { useEntity } from '@contexts/EntityContext';
import { customRender, fireEvent, screen } from '@lib/testing/test-utils';

jest.mock('@apps/borrower/hooks/useCompanyPhysicalCard');
jest.mock('@apps/borrower/hooks/useCompanyVirtualCard');
jest.mock('@contexts/EntityContext');
jest.mock('@hooks/useApi', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}));
jest.mock('@lib/actions/merchants', () => ({
  getMerchant: jest.fn(() => Promise.resolve({ id: 'merchant-1' })),
}));
jest.mock('@components/modals/ModalWrapper', () => ({
  __esModule: true,
  default: ({ children, isModalActive }) => (isModalActive ? <div>{children}</div> : null),
}));
jest.mock(
  '@apps/borrower/components/home/widgets/virtual_cards/vc_modal/MultiUseVCRulesModal',
  () => ({
    __esModule: true,
    default: ({ next }) => <button onClick={next}>Go To Next Step</button>,
  }),
);
jest.mock(
  '@apps/borrower/components/home/widgets/virtual_cards/vc_modal/CardholderAgreementModal',
  () => ({
    __esModule: true,
    default: () => <div>Cardholder Agreement Step</div>,
  }),
);
jest.mock(
  '@apps/borrower/components/payment_methods/modals/VcFlowDefaultPaymentMethodModal',
  () => ({
    __esModule: true,
    default: () => <div>Payment Method Step</div>,
  }),
);
jest.mock(
  '@apps/borrower/components/home/widgets/virtual_cards/vc_modal/SetDefaultTermsModal',
  () => ({
    __esModule: true,
    default: () => <div>Default Terms Step</div>,
  }),
);
jest.mock('@apps/borrower/components/home/widgets/virtual_cards/vc_modal/AddFundsModal', () => ({
  __esModule: true,
  default: () => <div>Add Funds Step</div>,
}));
jest.mock(
  '@apps/borrower/components/home/widgets/virtual_cards/vc_modal/MultiUseVirtualCardDetails',
  () => ({
    __esModule: true,
    default: () => <div>Virtual Card Details Step</div>,
  }),
);

const mockUseCompanyPhysicalCard = useCompanyPhysicalCard as jest.MockedFunction<
  typeof useCompanyPhysicalCard
>;
const mockUseCompanyVirtualCard = useCompanyVirtualCard as jest.MockedFunction<
  typeof useCompanyVirtualCard
>;
const mockUseEntity = useEntity as jest.MockedFunction<typeof useEntity>;

describe('MultiUseVirtualCardModalWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCompanyPhysicalCard.mockReturnValue({
      physicalCard: null,
      physicalCardError: null,
      physicalCardLoading: false,
      physicalCardRefetching: false,
      refetchPhysicalCard: jest.fn(),
    } as any);
    mockUseCompanyVirtualCard.mockReturnValue({
      virtualCard: null,
      virtualCardError: null,
      virtualCardLoading: false,
      virtualCardRefetching: false,
      refetchVirtualCard: jest.fn(),
    } as any);
    mockUseEntity.mockReturnValue({
      entity: {
        id: 'entity-1',
        is_bank_connected: false,
        recharge_settings: [],
      } as any,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    });
  });

  test('advances past the rules step while the modal is open', async () => {
    customRender(<MultiUseVirtualCardModalWrapper isModalActive={true} toggleModal={jest.fn()} />, {
      withBorrowerProviders: true,
    });

    fireEvent.click(screen.getByRole('button', { name: 'Go To Next Step' }));

    expect(await screen.findByText('Cardholder Agreement Step')).toBeInTheDocument();
  });
});
