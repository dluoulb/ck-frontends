import React from 'react';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

import useCompanyVirtualCard from '@apps/borrower/hooks/useCompanyVirtualCard';
import useVirtualCardBalance from '@apps/borrower/hooks/useVirtualCardBalance';
import { useBorrowerDeps } from '@contexts/BorrowerContext';
import { useEntity } from '@contexts/EntityContext';
import { formatCurrency, formatCurrencyPreventNegative } from '@lib/utils/formatters';

function getVirtualCardData(isJitEnabled, entity, balance) {
  if (!entity) return [];

  if (isJitEnabled) {
    return [
      {
        name: 'Able to Spend',
        value: formatCurrencyPreventNegative(
          parseFloat(entity?.vc_sub_limits?.remaining_limit_amount || '0'),
        ),
      },
    ];
  }
  return [
    {
      name: 'Pending Charges',
      value: formatCurrency(balance?.amount || 0),
    },
    {
      name: 'Able to Spend',
      value: formatCurrencyPreventNegative(
        parseFloat(entity?.vc_sub_limits?.remaining_limit_amount || '0'),
      ),
    },
  ];
}

export default function TclWidget() {
  const { entity } = useEntity();
  const { stats } = useBorrowerDeps();
  const { balance } = useVirtualCardBalance();
  const vcProps = useCompanyVirtualCard();
  const [open, setOpen] = React.useState(false);

  const isJitEnabled = vcProps?.virtualCard?.just_in_time_funding;

  if (!entity || !stats) return null;

  const remainingCredit =
    entity?.credit_line !== undefined
      ? entity.credit_line.remaining_amount
      : (entity.max_purchase_amount ?? 0) - (stats?.credit_utilized ?? 0);
  const approvedUser = entity?.status === 'approved';

  const entityData = [
    {
      name: 'Total Credit',
      value: !approvedUser ? '--' : formatCurrency(entity.max_purchase_amount),
    },
    {
      name: 'Credit in Use',
      value: !approvedUser ? '--' : formatCurrency(stats?.credit_utilized),
    },
    {
      name: 'Remaining Credit',
      value: !approvedUser ? '--' : formatCurrency(remainingCredit),
    },
  ];

  const virtualCardData = entity?.vc_enabled
    ? getVirtualCardData(isJitEnabled, entity, balance)
    : [];

  return (
    <DropdownMenu.Root modal={false} open={open} onOpenChange={setOpen}>
      <DropdownMenu.Trigger asChild>
        <div className="hidden lg:flex text-center items-center px-4 text-sm min-w-[130px] hover:cursor-pointer">
          <div className="lg:flex lg:flex-col items-center">
            <span className="font-medium">{formatCurrency(remainingCredit)}</span>
            <span className="text-xs text-[#636363]">Remaining credit</span>
          </div>
          <FontAwesomeIcon
            icon={open ? faChevronUp : faChevronDown}
            className="text-[0.6rem] pt-[5px] pl-2 font-bold"
          />
        </div>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content
        sideOffset={8}
        align="center"
        className="z-50 rounded-md border border-gray-200 bg-white shadow-md w-56 text-sm"
      >
        <DropdownMenu.Item disabled className="pointer-events-none">
          <div className="w-full">
            <div className="px-3 py-4">
              <p className="font-medium text-muted-foreground mb-1">My Credit Line</p>
              {entityData.map((item) => (
                <div className="flex justify-between" key={item.name}>
                  <span className="text-[#636363]">{item.name}</span>
                  <span className="font-medium">{item.value}</span>
                </div>
              ))}
            </div>
            {entity?.vc_enabled && <DropdownMenu.Separator className="h-px bg-gray-300" />}
            {entity?.vc_enabled && (
              <div className="px-3 py-4">
                <p className="font-medium text-muted-foreground mb-1">Virtual Card</p>
                {virtualCardData.map((item) => (
                  <div className="flex justify-between" key={item.name}>
                    <span className="text-[#636363]">{item.name}</span>
                    <span className="font-medium">{item.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
