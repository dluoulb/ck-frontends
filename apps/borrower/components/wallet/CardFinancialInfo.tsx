import React, { useMemo } from 'react';
import { faQuestionCircle } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import usePendingAuthorizations from '@apps/borrower/hooks/usePendingAuthorizations';
import { Skeleton } from '@components/components/ui/skeleton';
import Tooltip from '@components/Tooltip';
import { useBorrowerDeps } from '@contexts/BorrowerContext';
import { useEntity } from '@contexts/EntityContext';
import { formatCurrency, getTermDisplay } from '@lib/utils/formatters';

export default function CardFinancialInfo() {
  const { entity } = useEntity();
  const { pendingAuths, pendingAuthsLoading } = usePendingAuthorizations(
    entity?.id
  );
  const { defaultTermSettings } = useBorrowerDeps();

  const defaultTermSetting = defaultTermSettings.find(
    (setting) => setting.merchant_slug === 'virtual'
  );

  const defaultTerm = useMemo(() => {
    if (!defaultTermSetting) return '';
    return getTermDisplay(defaultTermSetting);
  }, [defaultTermSetting]);

  const ableToSpend = formatCurrency(
    entity?.vc_sub_limits?.remaining_limit_amount || 0
  );

  const pendingCharges = pendingAuths?.pending_total || 0;

  return (
    <div className="flex justify-between px-6 items-center max-w-lg mx-auto">
      <div className="flex flex-col">
        <span className="text-sm sm:text-lg font-semibold text-gray-900 whitespace-nowrap">
          {ableToSpend}
        </span>
        <span className="text-xs sm:text-sm text-gray-400 flex items-center gap-1">
          Able to spend
          <Tooltip
            tooltip_text={`Your remaining spend on your card is ${ableToSpend}`}
            trigger_class="cursor-pointer border-none"
            container_class="bg-gray-800 text-white"
          >
            <FontAwesomeIcon
              icon={faQuestionCircle}
              className="text-gray-400"
            />
          </Tooltip>
        </span>
      </div>

      <div className="flex flex-col">
        <span className="text-sm sm:text-lg font-semibold text-gray-900 whitespace-nowrap">
          {pendingAuthsLoading ? (
            <Skeleton className="w-full h-7" />
          ) : (
            formatCurrency(pendingCharges)
          )}
        </span>
        <span className="text-xs sm:text-sm text-gray-400">
          Pending charges
        </span>
      </div>

      <div className="flex flex-col ">
        <span className="text-sm sm:text-lg font-semibold text-gray-900 whitespace-nowrap">
          {defaultTermSettings?.length > 0 ? (
            defaultTerm
          ) : (
            <Skeleton className="w-full h-7" />
          )}
        </span>
        <span className="text-xs sm:text-sm text-gray-400">Default term</span>
      </div>
    </div>
  );
}
