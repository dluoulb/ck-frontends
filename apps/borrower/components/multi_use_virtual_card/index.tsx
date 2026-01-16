import Error from 'next/error';

import { BaseGrid, BaseGridItem } from '@components/BaseGrid';
import Loading from '@components/Loading';
import { useEntity } from '@contexts/EntityContext';
import useModal from '@hooks/useModal';
import HowToUse from '../home/widgets/virtual_cards/HowToUse';
import MultiUseVirtualCardWidget from '../home/widgets/virtual_cards/MultiUseVirtualCard';
import MultiUseVirtualCardModalWrapper from '../home/widgets/virtual_cards/vc_modal/MultiUseVirtualCardModalWrapper';

export default function MultiUseVirtualCard() {
  const { entity } = useEntity();
  const { isModalActive, toggleModal } = useModal();

  if (!entity) {
    return <Loading />;
  }

  if (!entity?.vc_enabled) {
    return <Error statusCode={404} />;
  }

  return (
    <div
      data-testid="container"
      className="my-4 md:my-6 mx-auto h-full"
      role={MultiUseVirtualCard.role}
    >
      <div className="mx-2 xl:max-w-[90%] xl:mx-auto h-full">
        <p className="text-2xl md:text-4xl font-bold text-primary capitalize">Credit Key Card</p>
        <div className="relative rounded-md border-t border-x border-border-gray shadow-sm mt-4 md:mt-8">
          <div className="py-2 md:py-3 px-2 md:px-3">
            <BaseGrid>
              <BaseGridItem gridConfig="col-span-5 !bg-primary-blue/10 mx-2 md:mr-3 md:ml-1.5">
                <MultiUseVirtualCardWidget />
              </BaseGridItem>
              <BaseGridItem gridConfig="col-span-5 mx-2 md:mr-3 md:ml-1.5 border-none">
                <HowToUse />
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
