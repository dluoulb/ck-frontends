import React from 'react';

import RedeemPointsModal from '@apps/borrower/components/plus/RedeemPointsModal';
import { useEntity } from '@contexts/EntityContext';
import usePaymentMethods from '@hooks/usePaymentMethods';
import { useRewardPointsBalance, useRewardPointsLedger } from '@hooks/useReward';
import useToast from '@hooks/useToast';
import { redeemPoints } from '@lib/actions/plus';
import { customRender, fireEvent, screen, waitFor } from '@lib/testing/test-utils';

jest.mock('@contexts/EntityContext');
jest.mock('@hooks/useApi', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}));
jest.mock('@hooks/usePaymentMethods', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('@hooks/useReward');
jest.mock('@hooks/useToast', () => ({
  __esModule: true,
  default: jest.fn(),
}));
jest.mock('@lib/actions/plus');
jest.mock('@components/modals/ModalWrapper', () => {
  function ModalWrapperMock({ children, isModalActive }) {
    return isModalActive ? <div>{children}</div> : null;
  }

  return ModalWrapperMock;
});
jest.mock('react-imask', () => {
  function MockIMaskInput({ onAccept, ...props }) {
    return (
      <input
        {...props}
        onChange={(event) => {
          onAccept(event.target.value);
        }}
      />
    );
  }

  return {
    IMaskInput: MockIMaskInput,
  };
});
const mockUseEntity = useEntity as jest.MockedFunction<typeof useEntity>;
const mockUsePaymentMethods = usePaymentMethods as jest.MockedFunction<typeof usePaymentMethods>;
const mockUseRewardPointsBalance = useRewardPointsBalance as jest.MockedFunction<
  typeof useRewardPointsBalance
>;
const mockUseRewardPointsLedger = useRewardPointsLedger as jest.MockedFunction<
  typeof useRewardPointsLedger
>;
const mockUseToast = useToast as jest.MockedFunction<typeof useToast>;
const mockRedeemPoints = redeemPoints as jest.MockedFunction<typeof redeemPoints>;

describe('RedeemPointsModal', () => {
  const mockToggleModal = jest.fn();
  const mockMakeToast = jest.fn();
  const mockRefetchRewardPointsBalance = jest.fn();
  const mockRefetchRewardPointsLedger = jest.fn();

  const renderModal = (availablePoints = 1000) =>
    customRender(
      <RedeemPointsModal
        isModalActive={true}
        toggleModal={mockToggleModal}
        availablePoints={availablePoints}
      />,
    );
  const getRedeemButton = () => screen.getByText('Redeem').closest('button');

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseEntity.mockReturnValue({
      entity: { id: 'entity_1' } as any,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    });

    mockUsePaymentMethods.mockReturnValue({
      defaultBank: { payment_method_last_4: '1234' } as any,
      activePaymentMethods: [],
      paymentMethodsLoading: false,
      paymentMethodsError: null,
      refetchPaymentMethods: jest.fn(),
    } as any);

    mockUseRewardPointsBalance.mockReturnValue({
      rewardPointsBalance: null,
      rewardPointsBalanceLoading: false,
      rewardPointsBalanceError: null,
      refetchRewardPointsBalance: mockRefetchRewardPointsBalance,
    });

    mockUseRewardPointsLedger.mockReturnValue({
      rewardPointsLedger: [],
      rewardPointsLedgerLoading: false,
      rewardPointsLedgerError: null,
      refetchRewardPointsLedger: mockRefetchRewardPointsLedger,
    });

    mockUseToast.mockReturnValue({
      makeToast: mockMakeToast,
      toastError: jest.fn(),
      toastSuccess: jest.fn(),
      clearToast: jest.fn(),
    } as any);

    mockRedeemPoints.mockResolvedValue({
      message: 'Redeemed successfully',
    } as any);
  });

  test('shows minimum error, disables redeem, and blocks submit when points are below 250', async () => {
    renderModal();

    fireEvent.change(screen.getByPlaceholderText('Enter points'), { target: { value: '249' } });

    expect(screen.getByText('Minimum redemption is 250 points ($2.50).')).toBeInTheDocument();

    const redeemButton = getRedeemButton();
    expect(redeemButton).toBeDisabled();

    fireEvent.click(redeemButton);

    await waitFor(() => {
      expect(mockRedeemPoints).not.toHaveBeenCalled();
    });
  });

  test('allows submitting when points are exactly 250', async () => {
    renderModal();

    fireEvent.change(screen.getByPlaceholderText('Enter points'), { target: { value: '250' } });

    const redeemButton = getRedeemButton();
    expect(redeemButton).not.toBeDisabled();

    fireEvent.click(redeemButton);

    await waitFor(() => {
      expect(mockRedeemPoints).toHaveBeenCalledWith(expect.anything(), 'entity_1', 250);
    });
  });

  test('allows submitting when points are above 250 and within available balance', async () => {
    renderModal();

    fireEvent.change(screen.getByPlaceholderText('Enter points'), { target: { value: '400' } });

    const redeemButton = getRedeemButton();
    expect(redeemButton).not.toBeDisabled();

    fireEvent.click(redeemButton);

    await waitFor(() => {
      expect(mockRedeemPoints).toHaveBeenCalledWith(expect.anything(), 'entity_1', 400);
    });
  });
});
