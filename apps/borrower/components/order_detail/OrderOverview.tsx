import React from 'react';
import classNames from 'classnames';

import Loading from '@components/Loading';
import { useBorrowerDeps } from '@contexts/BorrowerContext';
import { useUser } from '@contexts/UserContext';
import useModal from '@hooks/useModal';
import { reformatDate } from '@lib/utils/datetime_formatters';
import Documents from './Documents';
import ReturnsModal from './modals/ReturnsModal';

export default function OrderOverview({ order, product, documents }) {
  let statusColor;
  let statusText;
  const { user, isAdminUser } = useUser();
  const { isModalActive, toggleModal } = useModal();
  const { defaultBankLabel, defaultCardLabel } = useBorrowerDeps();
  const isPaymentPlan = order?.product_type !== 'mambu_loan';

  const status = isPaymentPlan
    ? product?.payment_plan_status.toLowerCase()
    : product?.status.toLowerCase();

  switch (status) {
    case 'paid':
    case 'void':
      statusColor = 'bg-gray-200 text-primary';
      statusText = status;
      break;
    case 'new':
      statusColor = 'bg-secondary-blue text-primary-blue';
      statusText = status;
      break;
    case 'active':
    case 'funded':
      statusColor = 'bg-background-success text-success';
      statusText = 'Active';
      break;
    default:
      statusColor = 'bg-secondary-blue text-primary-blue';
      statusText = status;
      break;
  }
  if (!user) return <Loading className="w-14 h-14 mt-5 mb-10" />;

  return (
    <div className="flex justify-between items-center px-8">
      <div className="w-full flex flex-col capitalize">
        <div className="flex items-start justify-between w-full">
          <p className="font-bold text-3xl text-primary-blue-hover mb-1">
            {order?.order_key}
          </p>
          <span
            className={classNames(
              'inline-flex items-center text-lg rounded-md px-4 py-2 font-semibold tracking-wide',
              statusColor
            )}
          >
            {statusText}
          </span>
        </div>
        <div className="flex justify-between items-end text-sm my-4">
          <div className="space-y-1">
            <p className="font-semibold">
              <span className="font-normal text-secondary-gray mr-1">
                Merchant:
              </span>
              {order?.merchant.name}
            </p>
            <p className="font-semibold">
              <span className="font-normal text-secondary-gray mr-1">
                Merchant Order ID:
              </span>
              {order?.merchant_order_id}
            </p>
            {product?.mambu_loan_id && (
              <p className="font-semibold">
                <span className="font-normal text-secondary-gray mr-1">
                  Mambu Loan ID:
                </span>
                {product?.mambu_loan_id}
              </p>
            )}
            <p className="font-semibold">
              <span className="font-normal text-secondary-gray mr-1">
                Disbursement Date:
              </span>
              {reformatDate(
                isPaymentPlan
                  ? product?.disbursement_date
                  : product?.capture_date,
                false
              )}
            </p>
            {(defaultBankLabel || defaultCardLabel) && (
              <p className="font-semibold">
                <span className="font-normal text-secondary-gray mr-1">
                  Paying from:
                </span>
                {order.entity_type !== 'account'
                  ? defaultBankLabel
                  : defaultCardLabel}
              </p>
            )}
          </div>
          <div className="text-right flex flex-col items-end gap-1">
            {isAdminUser && (
              <a
                href={order?.checkout_url}
                target="_new"
                className="text-sm text-primary-blue hover:text-primary-blue-hover font-medium border-b border-transparent hover:border-primary-blue-hover"
              >
                Checkout Session URL
              </a>
            )}
            <Documents order={order} documents={documents} />
            <p
              onClick={toggleModal}
              className="cursor-pointer text-sm text-primary-blue hover:text-primary-blue-hover flex items-center font-medium border-b border-transparent hover:border-primary-blue-hover"
            >
              Cancellations and Returns Policy
            </p>
            <ReturnsModal
              isModalActive={isModalActive}
              toggleModal={toggleModal}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
