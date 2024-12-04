import React, { useState } from 'react';

import Loading from '@components/Loading';
import { useBorrowerDeps } from '@contexts/BorrowerContext';
import { useEntity } from '@contexts/EntityContext';
import { BaseGrid, BaseGridItem } from '@components/BaseGrid';
import MultiUseVirtualCardWidget from '../home/widgets/virtual_cards/MultiUseVirtualCard';
import MultiUseVirtualCardModalWrapper from '../home/widgets/virtual_cards/vc_modal/MultiUseVirtualCardModalWrapper';
import useModal from '@hooks/useModal';
import DefaultVirtualCardTerms from '../home/widgets/default_settings/DefaultVirtualCardTerms';

export default function MultiUseVirtualCard() {
  const { entity, entityLoading } = useEntity();
  const { isLoading } = useBorrowerDeps();
  const { isModalActive, toggleModal } = useModal();

  if (isLoading || entityLoading)
    return <Loading className="w-14 h-14 my-20" />;

  if (!entity) return;

  return (
    <div
      data-testid="container"
      className="my-4 md:my-6 mx-auto h-full"
      role={MultiUseVirtualCard.role}
    >
      <div className="mx-2 2xl:max-w-[90%] md:mx-auto h-full">
        <p className="text-2xl md:text-4xl font-bold text-primary capitalize">
          Virtual Card
        </p>
        <div className="relative rounded-md border-t border-x border-border-gray shadow-sm mt-4 md:mt-8">
          <div className="py-2 md:py-3 px-2 md:px-3">
            <p className="text-xl">
              Use your Credit Key funds at any merchant!
            </p>
            <div className="grid grid-cols-12 gap-8 mt-4">
              <div className="col-span-5">
                <p>
                  A Credit Key Virtual Card unlocks your line of credit for use at 
                  any* merchant. Purchases can be made with the ease of credit card 
                  transactions. On a daily basis, transactions will be rolled up 
                  into a loan with simple terms, controlled by you!
                </p>
              </div>
            </div>
          </div>
          <div className="py-2 md:py-3 px-2 md:px-3">
          <BaseGrid>
            <BaseGridItem gridConfig="col-span-5 md:col-span-2 !bg-background-success/60 mx-2 md:mr-3 md:ml-1.5">
              <MultiUseVirtualCardWidget />
            </BaseGridItem>
            <BaseGridItem gridConfig="col-span-5 md:col-span-2 !bg-primary-blue/10 mx-2 md:mr-3 md:ml-1.5">
              <DefaultVirtualCardTerms />
            </BaseGridItem>
          </BaseGrid>
          </div>
        </div>
      </div>
      <MultiUseVirtualCardModalWrapper isModalActive={isModalActive} toggleModal={toggleModal} />
    </div>
  );
}

MultiUseVirtualCard.role = 'multi-use-virtual-card-page';

