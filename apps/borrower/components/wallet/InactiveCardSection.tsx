import React from 'react';
import { faQuestionCircle } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import useModal from '@hooks/useModal';
import ActivationBenefits from './ActivationBenefits';
import PhysicalHowToUseModal from './physical_card/HowToUseModal';
import InactivePhysicalCard from './physical_card/InactivePhysicalCard';
import VirtualHowToUseModal from './virtual_card/HowToUseModal';
import InactiveVirtualCard from './virtual_card/InactiveVirtualCard';

interface BenefitsConfig {
  title?: string;
  description?: string;
  benefits?: any[];
}

interface InactiveCardSectionProps {
  title: string;
  bgColor: string;
  cardType?: 'virtual' | 'physical';
  benefitsConfig?: BenefitsConfig;
}

export default function InactiveCardSection({
  title,
  bgColor,
  cardType = 'virtual',
  benefitsConfig = {},
}: InactiveCardSectionProps) {
  const { isModalActive, toggleModal } = useModal();

  return (
    <>
      <div className="space-y-4">
        <div className={`bg-[#${bgColor}] shadow-sm border border-gray-200 rounded-2xl`}>
          <div className="flex flex-col">
            <div className="w-full rounded-2xl bg-white border border-gray-200 mx-auto py-3">
              <div className="space-y-3 flex flex-col items-center">
                <div className="flex items-center justify-between w-full px-4">
                  <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                  <span className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg">
                    Inactive
                  </span>
                </div>

                {cardType === 'virtual' && <InactiveVirtualCard cardTitle={title} />}
                {cardType === 'physical' && <InactivePhysicalCard cardTitle={title} />}

                <button
                  onClick={toggleModal}
                  className="w-full max-w-lg text-bas pb-1 font-semibold text-primary-blue hover:text-primary-blue-hover flex items-center justify-center gap-2"
                >
                  <FontAwesomeIcon icon={faQuestionCircle} className="text-sm" />
                  How to Use
                </button>
              </div>
            </div>
            <ActivationBenefits
              title={benefitsConfig.title ?? ''}
              description={benefitsConfig.description ?? ''}
              benefits={benefitsConfig.benefits ?? []}
              bgColor={bgColor}
            />
          </div>
        </div>
      </div>

      {cardType === 'virtual' ? (
        <VirtualHowToUseModal isModalActive={isModalActive} toggleModal={toggleModal} />
      ) : (
        <PhysicalHowToUseModal isModalActive={isModalActive} toggleModal={toggleModal} />
      )}
    </>
  );
}
