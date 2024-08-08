import React from 'react';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { faBuilding } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { formatCurrency, formatPercent } from '@lib/utils/formatters';

export default function MerchantInfo({ order, product }) {
  const isPaymentPlan = order?.product_type !== 'mambu_loan';

  return (
    <div className="flex items-start gap-2" role={MerchantInfo.role}>
      <span className="fa-layers fa-fw text-4xl md:text-5xl hidden sm:inline">
        <FontAwesomeIcon icon={faCircle} className="text-secondary-blue" />
        <FontAwesomeIcon
          icon={faBuilding}
          className="text-primary-blue text-base md:text-xl"
        />
      </span>
      <div className="text-sm text-primary font-medium tracking-wide">
        <p className="font-semibold text-lg mb-1">Merchant Details</p>
        <p>
          <span className="text-tertiary-gray mr-2 font-normal">
            Merchant Name:
          </span>
          {order?.merchant?.name}
        </p>
        <p>
          <span className="text-tertiary-gray mr-2 font-normal">
            Merchant Fee:
          </span>
          {formatCurrency(product?.merchant_fee_amount)}
        </p>
        <p>
          <span className="text-tertiary-gray mr-2 font-normal">
            Merchant Rate:
          </span>
          {formatPercent(
            isPaymentPlan
              ? product?.merchant_fee_percent * 100
              : product?.merchant_fee * 100
          )}
        </p>
        <p>
          <span className="text-tertiary-gray mr-2 font-normal">
            Merchant Customer ID:
          </span>
          {order?.merchant_customer_id ? order?.merchant_customer_id : 'N/A'}
        </p>
        <p className="capitalize">
          <span className="text-tertiary-gray mr-2 font-normal">
            Merchant Type:
          </span>
          {order?.merchant?.type}
        </p>
      </div>
    </div>
  );
}

MerchantInfo.role = 'merchant-info-component';
