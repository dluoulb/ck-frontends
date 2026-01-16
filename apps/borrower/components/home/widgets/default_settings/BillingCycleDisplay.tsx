import React from 'react';

import { useEntity } from '@contexts/EntityContext';
import { formatBillingCycleDay } from '@lib/utils/formatters';

export default function BillingCycleDisplay() {
  const { entity } = useEntity();
  const consolidationSettings = entity?.consolidation_settings;

  if (!consolidationSettings || consolidationSettings.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <div className="font-semibold text-secondary-gray text-base md:text-lg mb-1">
        Billing Cycle
      </div>
      <div className="flex flex-col gap-2 w-full">
        {consolidationSettings?.map((setting, idx) => (
          <div
            key={setting.id || setting.merchant_id || idx}
            className="flex flex-col sm:flex-row md:flex-col xl:flex-row justify-between items-start sm:items-center md:items-start xl:items-center text-sm"
          >
            <span className="font-avenir-book text-opaque-navy text-sm pr-1">
              Merchant Name: <strong>{setting.merchant_name}</strong>
            </span>
            <span className="font-avenir-book text-opaque-navy text-sm pr-1">
              Billing Cycle:
              <strong className="ml-1">
                {`${formatBillingCycleDay(setting.day_of_month)} of each month`}
              </strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
