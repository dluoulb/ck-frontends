import React, { useEffect } from 'react';
import { faExclamationTriangle, faInfoCircle } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import Notification from '@components/Notification';
import Tooltip from '@components/Tooltip';
import { useBorrowerDeps } from '@contexts/BorrowerContext';
import { useEntity } from '@contexts/EntityContext';
import { useUser } from '@contexts/UserContext';
import useModal from '@hooks/useModal';
import usePaymentMethods from '@hooks/usePaymentMethods';
import { formatCurrency } from '@lib/utils/formatters';
import RequestIncreaseModal from './RequestIncreaseModal';

const requestIncreaseDeepLinkParam = 'request_credit_increase';
const requestIncreaseUnavailableTooltips = {
  company_status: 'Your company is currently not eligible for a credit request increase',
  pending_request: 'Your credit increase is under review',
  recent_credit_refresh: 'You are only able to request a credit line increase once every 6 months',
};
type RequestIncreaseUnavailableReason = keyof typeof requestIncreaseUnavailableTooltips;
const fallbackRequestIncreaseUnavailableTooltip =
  'You are currently unable to request a credit line increase';

export default function Stats() {
  const { entity } = useEntity();
  const { user } = useUser();
  const { stats, statsError, isLoading } = useBorrowerDeps();
  const { isModalActive, setIsModalActive } = useModal();

  const remainingCredit =
    entity?.credit_line !== undefined
      ? entity.credit_line.remaining_amount
      : (entity.max_purchase_amount ?? 0) - (stats?.credit_utilized ?? 0);
  const approvedUser = entity?.status === 'approved';
  const companyCanShowRequestIncrease = Boolean(entity?.type === 'company' && entity?.id);
  const lineIncreaseRequestAvailability =
    entity?.type === 'company' ? entity.line_increase_request_availability : undefined;
  const lineIncreaseRequestEligible =
    lineIncreaseRequestAvailability?.eligible ??
    entity?.eligible_for_line_increase_request ??
    false;
  const canRequestIncrease = Boolean(
    approvedUser && companyCanShowRequestIncrease && lineIncreaseRequestEligible,
  );
  const unavailableReason =
    lineIncreaseRequestAvailability?.reason ?? (approvedUser ? undefined : 'company_status');
  const unavailableTooltip =
    unavailableReason && unavailableReason in requestIncreaseUnavailableTooltips
      ? requestIncreaseUnavailableTooltips[unavailableReason as RequestIncreaseUnavailableReason]
      : fallbackRequestIncreaseUnavailableTooltip;
  const disabledRequestIncreaseTooltip = companyCanShowRequestIncrease
    ? unavailableTooltip
    : undefined;
  const disabledRequestIncreaseLabel =
    unavailableReason === 'pending_request' ? 'Increase Request Pending' : 'Request increase';
  const requestIncreaseCompanyId =
    canRequestIncrease && entity?.type === 'company' ? entity.id : undefined;
  const requestIncreaseAction = canRequestIncrease
    ? { disabled: false, name: 'Request Increase' }
    : companyCanShowRequestIncrease
      ? {
          disabled: true,
          name: disabledRequestIncreaseLabel,
          tooltipText: disabledRequestIncreaseTooltip,
        }
      : undefined;
  const hasConnectedPlaidAccount = Boolean(entity?.type === 'company' && entity.is_bank_connected);
  const currentCreditLimit = entity?.credit_line?.amount ?? entity?.max_purchase_amount ?? 0;
  const { defaultBank } = usePaymentMethods(
    user,
    entity,
    canRequestIncrease && hasConnectedPlaidAccount,
  );
  const hasRequestIncreaseDeepLink =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).get(requestIncreaseDeepLinkParam) === 'true';
  const openRequestIncreaseModal = () => {
    if (canRequestIncrease) {
      setIsModalActive(true);
    }
  };
  const closeRequestIncreaseModal = () => setIsModalActive(false);

  useEffect(() => {
    if (
      !hasRequestIncreaseDeepLink ||
      !canRequestIncrease ||
      isModalActive ||
      typeof window === 'undefined'
    ) {
      return;
    }

    const currentUrl = new URL(window.location.href);

    if (currentUrl.searchParams.get(requestIncreaseDeepLinkParam) !== 'true') {
      return;
    }

    currentUrl.searchParams.delete(requestIncreaseDeepLinkParam);
    window.history.replaceState(
      window.history.state,
      '',
      `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`,
    );
    setIsModalActive(true);
  }, [canRequestIncrease, hasRequestIncreaseDeepLink, isModalActive, setIsModalActive]);

  const entityData = [
    {
      name: 'Maximum Credit',
      value: !approvedUser ? '--' : formatCurrency(entity.max_purchase_amount),
      className: 'text-primary-blue-hover',
      action: requestIncreaseAction,
    },
    {
      name: 'Credit in Use',
      value: !approvedUser ? '--' : formatCurrency(stats?.credit_utilized),
      className: '',
    },
    {
      name: 'Remaining Credit',
      value: !approvedUser ? '--' : formatCurrency(remainingCredit),
      className: '',
    },
    {
      name: 'Active Orders',
      value: stats?.active,
      className: '',
    },
  ];

  if (!isLoading && (!stats || statsError))
    return (
      <Notification
        icon={faExclamationTriangle}
        iconBorderColor="border-error"
        textColor="text-error"
        bgColor="bg-error/20"
        buttonClass="hover:border-error"
        headline="An Error Occurred"
        message={`Unable to collect available ${entity?.type} credit and order data. Please contact Credit Key Support for assistance.`}
      />
    );

  return (
    <dl className="mx-auto grid grid-cols-2 gap-px lg:grid-cols-4">
      {entityData.map((stat, idx) => {
        return (
          <div
            key={stat.name}
            className={classNames(
              'flex flex-col md:gap-x-4 md:gap-y-2 bg-white pt-4 pb-2 md:pb-3',
              idx === 0 ? 'px-4' : 'px-4 md:pt-7 md:px-6',
            )}
          >
            <dt className="text-sm leading-3 text-tertiary-gray">{stat.name}</dt>
            <dd
              className={classNames(
                'w-full flex-none text-2xl md:text-3xl font-semibold leading-10 tracking-tight text-gray-900',
                stat.className,
              )}
            >
              {stat.action ? (
                <div className="flex flex-col items-start">
                  <span>{stat.value}</span>
                  <div className="flex items-center text-sm">
                    {stat.action.tooltipText ? (
                      <Tooltip
                        tooltip_text={stat.action.tooltipText}
                        trigger_class="cursor-not-allowed max-w-max border-none"
                        container_class="text-black p-4 px-6 text-sm bg-white"
                      >
                        <button
                          type="button"
                          disabled
                          title={stat.action.tooltipText}
                          className="text-xs text-primary-blue opacity-50 no-underline inline-block cursor-not-allowed pointer-events-none"
                        >
                          {stat.action.name}
                        </button>
                      </Tooltip>
                    ) : (
                      <button
                        type="button"
                        disabled={stat.action.disabled}
                        onClick={openRequestIncreaseModal}
                        className="text-xs text-primary-blue no-underline hover:underline inline-block"
                      >
                        {stat.action.name}
                      </button>
                    )}
                    {!stat.action.disabled && (
                      <Tooltip
                        tooltip_text="You are able to request a line increase once every 6 months"
                        trigger_class="cursor-pointer max-w-max border-none"
                        container_class="text-center text-black p-4 px-6 text-sm bg-secondary-blue"
                      >
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          className="text-tertiary-gray ml-2 text-base"
                        />
                      </Tooltip>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-start">
                  <span>{stat.value}</span>
                </div>
              )}
            </dd>
          </div>
        );
      })}
      {canRequestIncrease && (
        <RequestIncreaseModal
          companyId={requestIncreaseCompanyId}
          currentCreditLimit={currentCreditLimit}
          hasConnectedPlaidAccount={hasConnectedPlaidAccount}
          connectedBank={hasConnectedPlaidAccount ? (defaultBank ?? null) : null}
          isModalActive={isModalActive}
          toggleModal={closeRequestIncreaseModal}
        />
      )}
    </dl>
  );
}
