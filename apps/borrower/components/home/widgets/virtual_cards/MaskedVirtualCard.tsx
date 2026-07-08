import React from 'react';
import { faInfoCircle } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import Image from 'next/image';

import usePendingAuthorizations from '@apps/borrower/hooks/usePendingAuthorizations';
import PrimaryButton from '@components/buttons/PrimaryButton';
import { Skeleton } from '@components/components/ui/skeleton';
import Tooltip from '@components/Tooltip';
import { useEntity } from '@contexts/EntityContext';
import { CardStatus } from '@lib/constants/Enums';
import mcSvg from '@lib/images/mastercard.svg';
import { formatCurrency, formatCurrencyPreventNegative } from '@lib/utils/formatters';
import SupportWidget from '../SupportWidget';

export default function MaskedVirtualCard({ virtualCard, onView }) {
  const { entity } = useEntity();
  const { pendingAuths, pendingAuthsLoading } = usePendingAuthorizations(entity?.id);
  const isSuspended = virtualCard?.status === CardStatus.SUSPEND;

  const pendingCharges = pendingAuths?.pending_total || 0;

  return (
    <div className="w-full">
      <div
        data-testid="virtual-card-container"
        className={classNames(
          'flex flex-col md:flex-row justify-between border rounded-md px-6 p-4',
          {
            'border-error/50 bg-error/5': isSuspended,
            'border-border-gray': !isSuspended,
          },
        )}
      >
        <div className="w-full">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="flex gap-3">
              <Image src={mcSvg} alt="Credit Key Card Image" className="rounded-xl w-[32px]" />
              <div>
                <p className="text-lg md:text-xl text-primary font-semibold">
                  Credit Key Virtual Card ({virtualCard.last_four})
                </p>
                {isSuspended && (
                  <p
                    className="text-sm font-semibold text-error"
                    data-testid="virtual-card-suspended-status"
                  >
                    Suspended
                  </p>
                )}
                <p>
                  Able to spend:{' '}
                  <span className="font-semibold">
                    {formatCurrencyPreventNegative(
                      entity.vc_sub_limits.remaining_limit_amount || 0,
                    )}
                    {entity.vc_sub_limits?.limit_amount != null
                      ? ` of ${formatCurrency(entity.vc_sub_limits.limit_amount)}`
                      : null}
                    <Tooltip
                      tooltip_text={
                        entity.vc_sub_limits?.limit_amount != null &&
                        entity.max_purchase_amount != null
                          ? `Your Credit Key Card gives you access to ${formatCurrency(entity.vc_sub_limits.limit_amount)} of your ${formatCurrency(entity.max_purchase_amount)} credit line.`
                          : `The Credit Key Card is issued with its own credit limit, separate from your total trade credit limit.`
                      }
                      trigger_class="cursor-pointer max-w-max border-none"
                      container_class="text-center text-black p-4 px-6 text-sm bg-secondary-blue"
                    >
                      <FontAwesomeIcon
                        icon={faInfoCircle}
                        className="text-tertiary-gray ml-2 text-base"
                      />
                    </Tooltip>
                  </span>
                </p>
              </div>
            </div>
            <div className="flex flex-col md:items-center md:flex-row justify-between gap-2 md:gap-3 mt-2 md:m-0">
              <div className="flex items-center justify-center text-sm gap-2 py-1 md:py-2 px-3 rounded-[8px] disabled bg-[#eef1f6] cursor-default">
                <p>Pending</p>{' '}
                {pendingAuthsLoading ? (
                  <Skeleton className="w-14 h-full" />
                ) : (
                  <span className="font-semibold">{formatCurrency(pendingCharges)}</span>
                )}
              </div>
              {!isSuspended && (
                <PrimaryButton
                  buttonText="View Card"
                  buttonColor="whitespace-nowrap bg-primary-blue !rounded-[8px] max-h-[44px]"
                  hoverClass="hover:bg-primary-blue-hover"
                  onClick={onView}
                />
              )}
            </div>
          </div>
          {isSuspended && (
            <div className="mt-4 rounded-md border border-border-gray bg-secondary-blue">
              <SupportWidget showSuspendedCardPrompt />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
