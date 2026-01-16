import { DateTime } from 'luxon';

import { fromISO, sortDateTimes } from '@lib/utils/datetime_formatters';
import { formatCurrency } from '@lib/utils/formatters';
import Tooltip from '../../../shared/components/Tooltip';

export const calculateFeeTotals = (order) => {
  const fees = {};

  if (!order?.product?.transactions) return;

  order?.product?.transactions.forEach((transaction) => {
    if (
      [
        'processing_fee',
        'processing_fee_adjustment',
        'finance_fee',
        'finance_fee_adjustment',
        'nsf_fee',
      ].includes(transaction.transaction_type.toLowerCase())
    ) {
      const transactionType = transaction.transaction_type;
      const amount = parseFloat(transaction.amount);

      if (!fees[transactionType]) {
        fees[transactionType] = {
          fee_type: transactionType,
          count: 0,
          totalAmount: 0,
          fees: [],
          adjustments: null,
        };
      }

      fees[transactionType].count++;
      fees[transactionType].totalAmount += amount;
      fees[transactionType].fees.push(transaction);
    }
  });

  return Object.values(fees);
};

export const getFeeTitle = (type) => {
  switch (type) {
    case 'FINANCE_FEE':
      return 'Interest Fee';
    case 'PROCESSING_FEE':
      return 'Service Fee';
    case 'NSF_FEE':
      return (
        <span>
          <Tooltip
            tooltip_text="Non-Sufficient Funds fees are applied for failed payment attempts"
            trigger_class="cursor-pointer border-b border-dashed border-navy-blue"
            container_class="text-center p-4 px-6 text-sm bg-secondary-blue"
          >
            NSF Fee
          </Tooltip>
        </span>
      );
  }
};

export const getCompressedFeeSummary = (feeSummary) => {
  const result = [];
  const feeDisplaySettings = {};

  feeSummary.forEach((feeObject) => {
    if (feeObject.fee_type.includes('_ADJUSTMENT')) {
      const match = feeSummary.find(
        (item) => item.fee_type === feeObject.fee_type.replace('_ADJUSTMENT', ''),
      );

      if (match) {
        match.adjustments = feeObject;
      }
    } else {
      result.push(feeObject);
    }
  });

  result.forEach((fee) => {
    feeDisplaySettings[fee.fee_type] = false;
  });

  return { result, feeDisplaySettings };
};

export const getFeeBreakdownDisplay = (originalFee, feeAdjustments) => {
  const consolidated = originalFee.fees.map((item) => {
    return {
      date: item.value_date,
      amount: parseFloat(item?.amount),
    };
  });

  feeAdjustments.fees.forEach((f, idx) => {
    if (f.transaction_type === 'PROCESSING_FEE_ADJUSTMENT') {
      if (idx !== feeAdjustments.fees.length - 1) return;
      consolidated[0].amount -= parseFloat(f.amount);
      return consolidated;
    }

    consolidated.push({
      date: f.value_date,
      amount: -f.amount,
    });
  });

  consolidated.sort((a, b) => sortDateTimes(a.date, b.date));

  return consolidated.map((c, idx) => {
    return (
      <div key={idx} className="py-2 flex justify-between text-navy-blue">
        <p>{fromISO(c.date).toLocaleString(DateTime.DATE_SHORT)}</p>
        <p className={c.amount < 0 ? 'text-negative-red' : ''}>{formatCurrency(c.amount)}</p>
      </div>
    );
  });
};
