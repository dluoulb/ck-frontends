import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useBorrowerDeps } from '@contexts/BorrowerContext';
import { useEntity } from '@contexts/EntityContext';
import useApi from '@hooks/useApi';
import useModal from '@hooks/useModal';
import useToast from '@hooks/useToast';
import { updateCompany } from '@lib/actions/companies';
import DefaultTermSettingsModal from './DefaultTermsModal';
import { faEdit } from '@fortawesome/pro-regular-svg-icons';

export default function DefaultTermsDisplay() {
  const api = useApi();
  const { makeToast } = useToast();
  const { entity, fetchEntity } = useEntity();
  const { defaultTermSettings } = useBorrowerDeps();

  const [loading, setLoading] = useState(false);
  const { toggleModal, isModalActive, modalState, setModalState } = useModal(
    defaultTermSettings[0]
  );

  const getTermDisplay = (term) => {
    if (term.default_term?.term_period === 'days') return '30 Days';

    if (term.default_term?.term > 1) {
      return `${term.default_term?.term} Months`;
    } else {
      return `${term.default_term?.term} Month`;
    }
  };

  const onSave = (merchant_id, term) => {
    setLoading(true);
    const updatedCompany = {
      ...entity,
      recharge_settings: entity.recharge_settings.map((item) =>
        item.merchant_id === merchant_id
          ? {
              ...item,
              default_term: term.term,
              default_term_period: term.term_period,
            }
          : item
      ),
    };

    updateCompany(api, updatedCompany, 'include=cta_banners')
      .then(() => {
        fetchEntity({ company_id: entity?.id });
        toggleModal();
        makeToast('Recharge Settings Successfully Updated', 'success');
      })
      .catch((err) => {
        makeToast(
          'An error occurred. Please contact Credit Key Support',
          'error'
        );
      })
      .finally(() => setLoading(false));
  };

  if (!defaultTermSettings?.length) return;

  return (
    <div className="flex flex-col gap-2 w-full" role={DefaultTermsDisplay.role}>
      {defaultTermSettings && (
        <DefaultTermSettingsModal
          modalState={modalState}
          onSave={onSave}
          isModalActive={isModalActive}
          toggleModal={toggleModal}
          loading={loading}
        />
      )}
      {defaultTermSettings.map((s, idx) => {
        return (
          <div
            key={idx}
            className="flex flex-col xs:flex-row md:flex-col xl:flex-row gap-1 justify-between items-start xs:items-center md:items-start xl:items-center"
          >
            <p className="font-avenir-book text-opaque-navy text-sm pr-1">
              Merchant Name:
              <strong className="ml-1">{s.merchant_name}</strong>
            </p>
            <div className="flex items-center">
              {!s.default_term ? (
                <strong
                  className="text-primary-blue-hover text-sm cursor-pointer border-b border-transparent hover:border-primary-blue"
                  onClick={() => {
                    setModalState(s);
                    toggleModal();
                  }}
                >
                  Add Default Term
                </strong>
              ) : (
                <p className="font-avenir-book text-opaque-navy text-sm pr-1">
                  Default Term:
                  <strong className="ml-1">{getTermDisplay(s)}</strong>
                  {entity?.tier !== 'NETX' && (
                    <FontAwesomeIcon
                      className="ml-2 text-primary-blue cursor-pointer"
                      icon={faEdit}
                      onClick={() => {
                        setModalState(s);
                        toggleModal();
                      }}
                    />
                  )}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

DefaultTermsDisplay.role = 'default-term-display-component';
