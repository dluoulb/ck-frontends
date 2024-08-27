import React from 'react';

import { BaseGridItem } from '@components/BaseGrid';
import CreditKeyAnywhere from './CreditKeyAnywhere';
import DefaultSettings from './default_settings/DefaultSettings';
import SupportWidget from './SupportWidget';
import VirtualCard from './virtual_cards/VirtualCard';

export default function Widgets({ entity, paymentMethods, defaultTerms }) {
  const activeBanner = entity?.cta_banners?.find((b) => b.enabled);
  const vcEnabled = ['virtual_card', 'qolo_virtual_card'].includes(
    activeBanner?.name
  );

  return (
    <>
      <BaseGridItem gridConfig="col-span-5 md:col-span-2 !bg-primary-blue/10 mx-1 md:ml-3 md:mr-1.5">
        <DefaultSettings
          entity={entity}
          paymentMethods={paymentMethods}
          defaultTerms={defaultTerms}
        />
      </BaseGridItem>

      <BaseGridItem gridConfig="col-span-5 md:col-span-2 !bg-tertiary-gray/20 mx-1 md:mr-3 md:ml-1.5">
        <SupportWidget />
      </BaseGridItem>
      <BaseGridItem
        gridConfig={
          vcEnabled
            ? 'col-span-5 md:col-span-2 !bg-primary-beige/20 mx-1 md:ml-3 md:mr-1.5'
            : 'col-span-5 !bg-primary-beige/20 mx-1 md:mx-3'
        }
      >
        <CreditKeyAnywhere />
      </BaseGridItem>

      {/* // TODO: FIGURE OUT WHAT THE QOLO VC WIDGET IS */}
      {vcEnabled && (
        <BaseGridItem gridConfig="col-span-5 md:col-span-2 !bg-background-success/60 mx-1 md:mr-3 md:ml-1.5">
          <VirtualCard entity={entity} />
        </BaseGridItem>
      )}
    </>
  );
}
