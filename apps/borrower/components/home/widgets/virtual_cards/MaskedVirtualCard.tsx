import React from 'react';
import { faInfoCircle } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';

import usePendingAuthorizations from '@apps/borrower/hooks/usePendingAuthorizations';
import PrimaryButton from '@components/buttons/PrimaryButton';
import { Skeleton } from '@components/components/ui/skeleton';
import Tooltip from '@components/Tooltip';
import { useEntity } from '@contexts/EntityContext';
import mcSvg from '@lib/images/mastercard.svg';
import { formatCurrency, formatCurrencyPreventNegative } from '@lib/utils/formatters';

export default function MaskedVirtualCard({ virtualCard, onView }) {
  const { entity } = useEntity();
  const { pendingAuths, pendingAuthsLoading } = usePendingAuthorizations(entity?.id);

  const pendingCharges = pendingAuths?.pending_total || 0;

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between border border-border-gray rounded-md px-6 p-4">
        <div className="flex gap-3">
          <Image src={mcSvg} alt="Credit Key Card Image" className="rounded-xl w-[32px]" />
          <div>
            <p className="text-lg md:text-xl text-primary font-semibold">
              Credit Key Virtual Card ({virtualCard.last_four})
            </p>
            <p>
              Able to spend:{' '}
              <span className="font-semibold">
                {formatCurrencyPreventNegative(entity.vc_sub_limits.remaining_limit_amount || 0)}
                <Tooltip
                  tooltip_text={`The Credit Key Card is issued with its own credit limit, separate from your total trade credit limit.`}
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
          <PrimaryButton
            buttonText="View Card"
            buttonColor="whitespace-nowrap bg-primary-blue !rounded-[8px] max-h-[44px]"
            hoverClass="hover:bg-primary-blue-hover"
            onClick={onView}
          />
        </div>
      </div>
    </div>
  );
}
