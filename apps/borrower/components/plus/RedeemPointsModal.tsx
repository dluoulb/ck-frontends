import React, { useMemo, useState } from 'react';
import * as RadioGroup from '@radix-ui/react-radio-group';
import { IMaskInput } from 'react-imask';

import PrimaryButton from '@components/buttons/PrimaryButton';
import ModalWrapper from '@components/modals/ModalWrapper';
import { useEntity } from '@contexts/EntityContext';
import { useUser } from '@contexts/UserContext';
import useApi from '@hooks/useApi';
import usePaymentMethods from '@hooks/usePaymentMethods';
import {
  useRewardPointsBalance,
  useRewardPointsLedger,
} from '@hooks/useReward';
import useToast from '@hooks/useToast';
import { redeemPoints } from '@lib/actions/plus';
import { formatCurrency } from '@lib/utils/formatters';

type RedeemPointsModalProps = {
  isModalActive: boolean;
  toggleModal: () => void;
  availablePoints: number;
};

export default function RedeemPointsModal({
  isModalActive,
  toggleModal,
  availablePoints,
}: RedeemPointsModalProps) {
  const { user } = useUser();
  const { entity } = useEntity();
  const api = useApi();
  const { makeToast } = useToast();
  const { defaultBank } = usePaymentMethods(user, entity, true);
  const { refetchRewardPointsBalance } = useRewardPointsBalance(entity?.id);
  const { refetchRewardPointsLedger } = useRewardPointsLedger(entity?.id);

  const [pointsToRedeem, setPointsToRedeem] = useState<number>(0);
  const [redemptionMethod, setRedemptionMethod] = useState<string>('ach');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redemptionValue = useMemo(() => {
    return pointsToRedeem / 100;
  }, [pointsToRedeem]);

  const isValidPoints = useMemo(() => {
    return (
      Number.isInteger(pointsToRedeem) &&
      pointsToRedeem > 0 &&
      pointsToRedeem <= availablePoints
    );
  }, [pointsToRedeem, availablePoints]);

  const handlePointsChange = (value: string) => {
    const numValue = parseInt(value, 10) || 0;
    setPointsToRedeem(numValue);
  };

  const handleRedeem = async () => {
    if (!isValidPoints || !entity?.id) return;

    setIsSubmitting(true);
    try {
      const result = await redeemPoints(api, entity.id, pointsToRedeem);

      makeToast(
        result.message ??
          `Successfully redeemed ${pointsToRedeem} points (${formatCurrency(redemptionValue)})`,
        'success'
      );

      await refetchRewardPointsBalance();
      await refetchRewardPointsLedger();

      toggleModal();
      setPointsToRedeem(0);
    } catch {
      makeToast('Failed to redeem points. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalWrapper
      isModalActive={isModalActive}
      toggleModal={toggleModal}
      modalWidth="w-[500px]"
    >
      <div className="space-y-3">
        <div>
          <h2 className="text-lg font-bold">Redeem Points</h2>
          <p className="text-sm text-gray-400">
            Enter the amount of points you'd like to redeem.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Points to redeem</label>
          <IMaskInput
            mask={/^\d*$/}
            value={pointsToRedeem.toString()}
            onAccept={handlePointsChange}
            placeholder="Enter points"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              pointsToRedeem > availablePoints
                ? 'border-error focus:ring-error focus:border-error'
                : 'border-primary-gray-border focus:ring-primary-blue focus:border-transparent'
            }`}
          />
          {pointsToRedeem > availablePoints ? (
            <p className="text-xs text-error font-medium">
              You cannot redeem more than {availablePoints.toLocaleString()}{' '}
              points
            </p>
          ) : (
            <p className="text-xs text-secondary-gray">
              Available: {availablePoints.toLocaleString()} points
            </p>
          )}
        </div>

        <div className="bg-gray-100 rounded-md px-4 py-3">
          <div className="font-bold text-sm">
            Redemption Value: {formatCurrency(redemptionValue)}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">Redemption Method</label>
          <RadioGroup.Root
            value={redemptionMethod}
            onValueChange={setRedemptionMethod}
            className="space-y-3"
          >
            <label
              className="flex items-start space-x-3 p-3 border border-primary-gray-border rounded-md hover:bg-gray-50 cursor-pointer"
              onClick={() => setRedemptionMethod('ach')}
            >
              <RadioGroup.Item
                value="ach"
                className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center mt-0.5 data-[state=checked]:border-primary-blue data-[state=checked]:bg-primary-blue"
              >
                <RadioGroup.Indicator className="w-2.5 h-2.5 rounded-full bg-white" />
              </RadioGroup.Item>
              <div className="flex-1">
                <div className="font-medium text-sm">ACH Transfer</div>
                {defaultBank ? (
                  <div className="mt-1 space-y-1">
                    <p className="text-sm">
                      Send to default bank account x
                      {defaultBank.payment_method_last_4}
                    </p>
                    <p className="text-sm text-secondary-gray">
                      Funds typically arrive in 1-3 business days
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-secondary-gray mt-1">
                    No bank account linked
                  </p>
                )}
              </div>
            </label>
          </RadioGroup.Root>
        </div>

        <div className="pt-4">
          <PrimaryButton
            buttonText="Redeem"
            buttonColor="bg-primary-blue"
            hoverClass="hover:bg-primary-blue-hover"
            containerClass="w-full"
            onClick={handleRedeem}
            disabled={!isValidPoints || isSubmitting || !defaultBank}
            isLoading={isSubmitting}
          />
        </div>
      </div>
    </ModalWrapper>
  );
}
