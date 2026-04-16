import React from 'react';
import { faCog, faQuestionCircle } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import useModal from '@hooks/useModal';
import CompanyVirtualCardRecord from '@lib/records/company_virtual_card';
import CardFinancialInfo from './CardFinancialInfo';
import ManageCardModal from './ManageCardModal';
import ActivePhysicalCard from './physical_card/ActivePhysicalCard';
import ActiveVirtualCard from './virtual_card/ActiveVirtualCard';
import HowToUseModal from './virtual_card/HowToUseModal';

interface ActiveCardSectionProps {
  card: CompanyVirtualCardRecord;
  cardType?: 'virtual' | 'physical';
  showWidget?: boolean;
  onShowWidget?: () => void;
  onHideWidget?: () => void;
  defaultTermSetting?: {
    merchant_id?: string;
    merchant_name?: string;
    merchant_slug?: string;
    default_term?: {
      term?: number | string;
      term_period?: string;
    };
    term_options?: unknown[];
  };
}

export default function ActiveCardSection({
  card,
  cardType = 'virtual',
  showWidget,
  onShowWidget,
  onHideWidget,
  defaultTermSetting,
}: ActiveCardSectionProps) {
  const { isModalActive: isHowToUseModalActive, toggleModal: toggleHowToUseModal } = useModal();

  const { isModalActive: isManageModalActive, toggleModal: toggleManageModal } = useModal();
  const normalizedStatus = card.status?.toUpperCase?.() ?? '';
  const statusBadge =
    normalizedStatus === 'ACTIVE'
      ? {
          label: 'Active',
          className: 'bg-green-100 text-green-700',
        }
      : normalizedStatus === 'PENDING'
        ? {
            label: 'Pending',
            className: 'bg-amber-100 text-amber-700',
          }
        : {
            label: normalizedStatus ? normalizedStatus.toLowerCase() : 'Inactive',
            className: 'bg-gray-100 text-gray-600',
          };

  return (
    <>
      <div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm py-3">
          <div className="space-y-3">
            <div className="flex items-center justify-between px-4">
              <h3 className="text-lg font-bold text-gray-900 whitespace-nowrap">
                {cardType === 'virtual' ? 'Credit Key Virtual Card' : 'Credit Key Physical Card'}
              </h3>
              <span
                className={`px-3 py-1 text-xs font-medium rounded-lg capitalize ${statusBadge.className}`}
              >
                {statusBadge.label}
              </span>
            </div>

            {cardType === 'virtual' ? (
              <ActiveVirtualCard
                card={card}
                showWidget={showWidget}
                onShowWidget={onShowWidget}
                onHideWidget={onHideWidget}
              />
            ) : (
              <ActivePhysicalCard
                card={card}
                showWidget={showWidget}
                onShowWidget={onShowWidget}
                onHideWidget={onHideWidget}
              />
            )}

            <CardFinancialInfo defaultTermSetting={defaultTermSetting} />

            <div className="flex items-center px-6 pt-2 max-w-lg mx-auto">
              <button
                onClick={toggleManageModal}
                className="text-primary-blue hover:text-primary-blue-hover text-base font-semibold flex items-center gap-2 flex-1 justify-center"
              >
                <FontAwesomeIcon icon={faCog} className="text-sm" />
                Manage
              </button>

              {cardType === 'virtual' && (
                <button
                  onClick={toggleHowToUseModal}
                  className="text-primary-blue hover:text-primary-blue-hover text-base font-semibold flex items-center gap-2 flex-1 justify-center"
                >
                  <FontAwesomeIcon icon={faQuestionCircle} className="text-sm" />
                  How to Use
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {cardType === 'virtual' && (
        <HowToUseModal isModalActive={isHowToUseModalActive} toggleModal={toggleHowToUseModal} />
      )}

      <ManageCardModal isModalActive={isManageModalActive} toggleModal={toggleManageModal} />
    </>
  );
}
