import React from 'react';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { faBuilding } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { reformatDate } from '@lib/utils/datetime_formatters';
import { formatCurrency } from '@lib/utils/formatters';

export default function ProductInfo({ order, product }) {
  const isPaymentPlan = order?.product_type !== 'mambu_loan';

  return (
    <div className="flex items-start gap-2 capitalize" role={ProductInfo.role}>
      <span className="fa-layers fa-fw text-4xl md:text-5xl hidden sm:inline">
        <FontAwesomeIcon icon={faCircle} className="text-secondary-blue" />
        <FontAwesomeIcon icon={faBuilding} className="text-primary-blue text-base md:text-xl" />
      </span>
      <div className="text-sm text-primary font-medium tracking-wide">
        <p className="font-semibold text-lg mb-1">Product Details</p>
        <p className="capitalize">
          <span className="text-tertiary-gray mr-2 font-normal">Type:</span>
          {order?.product_type.replaceAll('_', ' ')}
        </p>
        <p>
          <span className="text-tertiary-gray mr-2 font-normal">
            {isPaymentPlan ? 'payment plan' : 'loan'} ID:
          </span>
          {product?.id}
        </p>
        <p>
          <span className="text-tertiary-gray mr-2 font-normal">Disbursement date:</span>
          {reformatDate(isPaymentPlan ? product?.disbursement_date : product?.capture_date)}
        </p>
        <p>
          <span className="text-tertiary-gray mr-2 font-normal">number of installments:</span>
          {product?.installments}
        </p>
        <p>
          <span className="text-tertiary-gray mr-2 font-normal">payoff balance:</span>
          {formatCurrency(product?.payoff_balance)}
        </p>
      </div>
    </div>
  );
}

ProductInfo.role = 'product-info-component';
