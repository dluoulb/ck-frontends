import React, { useMemo } from 'react';

import useCashBackMerchants from '@hooks/useCashBackMerchants';
import { TopCashbackMerchant } from '@lib/actions/merchants';
import MerchantCard from './MerchantCard';

const MERCHANT_COUNT = 4;

export const selectRandomMerchants = (merchants: TopCashbackMerchant[], count = MERCHANT_COUNT) => {
  if (!Array.isArray(merchants) || merchants.length <= count) return merchants;

  const shuffled = [...merchants];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const swapIndex = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[i]];
  }

  return shuffled.slice(0, count);
};

export default function MerchantsSection() {
  const { cashBackMerchants, cashBackMerchantsError, cashBackMerchantsLoading } =
    useCashBackMerchants();
  const merchants = useMemo(
    () => selectRandomMerchants(cashBackMerchants, MERCHANT_COUNT),
    [cashBackMerchants],
  );
  const error = Boolean(cashBackMerchantsError);
  const loading = cashBackMerchantsLoading;

  if (!loading && !error && merchants.length === 0) return null;

  return (
    <section className="mt-6" data-testid="reward-merchants-section">
      {loading && <div className="p-6 text-sm text-gray-500">Loading merchant offers...</div>}

      {!loading && error && (
        <div className="p-6 text-sm text-gray-500">Unable to load merchant offers right now.</div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {merchants.map((merchant) => (
            <MerchantCard key={merchant.id} merchant={merchant} />
          ))}
        </div>
      )}
    </section>
  );
}
