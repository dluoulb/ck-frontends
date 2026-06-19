import React from 'react';
import Image from 'next/image';

import { marketplace } from '@lib/actions/marketplace';
import { TopCashbackMerchant } from '@lib/actions/merchants';
import logoOnly from '@lib/images/logo_only.svg';

const isSafeUrl = (url: string): boolean => {
  try {
    const { protocol } = new URL(url);
    return protocol === 'http:' || protocol === 'https:';
  } catch {
    return false;
  }
};

const getMerchantUrl = (merchant: TopCashbackMerchant) => {
  if (merchant.marketplaceUrl && isSafeUrl(merchant.marketplaceUrl)) {
    return merchant.marketplaceUrl;
  }
  if (merchant.slug && marketplace.url) {
    return new URL(`/merchants/${merchant.slug}`, marketplace.url).toString();
  }
  return marketplace.url;
};

type MerchantCardProps = {
  merchant: TopCashbackMerchant;
};

const getInitials = (name: string) =>
  name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

export default function MerchantCard({ merchant }: MerchantCardProps) {
  return (
    <a
      href={getMerchantUrl(merchant)}
      target="_blank"
      rel="noopener noreferrer"
      className="block border border-[#C9D6E8] rounded-2xl bg-white p-4 no-underline hover:shadow-sm hover:border-primary-blue transition-colors"
      data-testid="reward-merchant-card"
    >
      <div className="flex gap-4 items-start">
        <div className="w-24 h-24 rounded-xl border border-[#C9D6E8] bg-white flex items-center justify-center shrink-0 overflow-hidden">
          {merchant.logoUrl ? (
            <Image
              src={merchant.logoUrl}
              alt={`${merchant.name} logo`}
              width={84}
              height={84}
              className="max-w-[84px] max-h-[84px] object-contain"
              unoptimized
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-[#EEF2F7] text-primary text-sm font-semibold flex items-center justify-center">
              {getInitials(merchant.name)}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 pt-1">
          <p className="text-[15px] font-semibold text-primary leading-5 truncate">
            {merchant.name}
          </p>
          <div className="flex flex-wrap gap-2 mt-2">
            {merchant.cashbackLabel && (
              <span className="inline-flex items-center rounded-full bg-[#D9F2DF] px-3 py-1 text-sm font-medium text-[#0C9B4E] leading-none">
                {merchant.cashbackLabel}
              </span>
            )}
            {merchant.plusBonusLabel && (
              <span className="inline-flex items-center rounded-full bg-[#E8EEFF] px-3 py-1 text-sm font-medium text-[#2F5BFF] leading-none">
                <Image src={logoOnly} alt="" width={10} height={12} className="mr-1.5 h-3 w-auto" />
                {merchant.plusBonusLabel}
              </span>
            )}
          </div>
          {merchant.description && (
            <p className="mt-2 text-[15px] leading-6 text-primary line-clamp-2">
              {merchant.description}
            </p>
          )}
        </div>
      </div>
    </a>
  );
}
