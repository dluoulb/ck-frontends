import React from 'react';
import Link from 'next/link';

import { BaseGridItem } from '@components/BaseGrid';
import OutlineButton from '@components/buttons/OutlineButton';
import { useEntity } from '@contexts/EntityContext';
import CkaLink from './CkaLink';
import SettingsWidget from './default_settings';
import MarketplaceLink from './MarketplaceLink';
import SupportWidget from './SupportWidget';
import VirtualCard from './virtual_cards/VirtualCard';

export default function Widgets() {
  const { entity } = useEntity();

  const activeBanner = entity?.cta_banners?.find((b) => b.enabled);
  const vcEnabled = ['virtual_card', 'multi_use_virtual_card'].includes(activeBanner?.name);
  const isAmazonExclusive = entity?.isAmazonExclusive ?? false;

  return (
    <>
      <div className="col-span-7 mt-2">
        <div className="flex items-center justify-between capitalize">
          <p className="text-xl font-medium mb-2">Ways to use your credit</p>
          <Link
            href="/wallet"
            className="py-1 mid:py-0 flex items-center gap-1 text-primary-blue-hover font-medium group text-sm min-w-24 max-h-max"
          >
            {!!entity?.vc_enabled && (
              <OutlineButton
                ariaLabel="export-payment-history"
                buttonText="Open Wallet"
                buttonColor="bg-white !text-primary !font-medium border border-border-gray !mt-0 !rounded-[8px]"
                hoverClass="hover:bg-gray-100"
                containerClass="2xs:max-w-max md:max-w-auto"
              />
            )}
          </Link>
        </div>
      </div>
      {activeBanner && vcEnabled && (
        <BaseGridItem gridConfig="col-span-7 md:col-span-7">
          <VirtualCard bannerName={activeBanner.name} />
        </BaseGridItem>
      )}

      {!isAmazonExclusive && (
        <BaseGridItem gridConfig="col-span-7 mt-2">
          <MarketplaceLink />
        </BaseGridItem>
      )}
      {!isAmazonExclusive && (
        <BaseGridItem gridConfig="col-span-7 my-2">
          <CkaLink />
        </BaseGridItem>
      )}

      <SettingsWidget />

      <BaseGridItem gridConfig="col-span-7 md:col-span-3 rounded-md !bg-[#F4F8FF] border border-border-gray rounded-md md:ml-2 mt-2 sm:mt-0">
        <SupportWidget />
      </BaseGridItem>
    </>
  );
}
