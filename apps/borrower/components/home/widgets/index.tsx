import React from 'react';

import { BaseGridItem } from '@components/BaseGrid';
import { useEntity } from '@contexts/EntityContext';
import SettingsWidget from './default_settings';
import SupportWidget from './SupportWidget';
import VirtualCard from './virtual_cards/VirtualCard';

export default function Widgets() {
  const { entity } = useEntity();

  const activeBanner = entity?.cta_banners?.find((b) => b.enabled);
  const vcEnabled = ['virtual_card', 'multi_use_virtual_card'].includes(
    activeBanner?.name
  );

  return (
    <>
      {activeBanner && vcEnabled && (
        <BaseGridItem gridConfig="col-span-7 md:col-span-7 !bg-primary-blue/10 mx-2 md:mr-3 md:ml-3">
          <VirtualCard bannerName={activeBanner.name} />
        </BaseGridItem>
      )}

      <SettingsWidget />

      <BaseGridItem gridConfig="col-span-7 md:col-span-3 !bg-primary-beige/20 mx-2 md:mx-3 lg:mr-3 lg:ml-1.5">
        <SupportWidget />
      </BaseGridItem>
    </>
  );
}
