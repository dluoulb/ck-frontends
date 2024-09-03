import React, { useState } from 'react';
import { faPenToSquare } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import Loading from '@components/Loading';
import { useBorrowerDeps } from '@contexts';
import useApi from '@hooks/useApi';
import useModal from '@hooks/useModal';
import useToast from '@hooks/useToast';
import { updateCompany } from '@lib/actions/companies';
import DefaultTermSettingsModal from './DefaultTermsModal';

export default function DefaultTermsDisplay() {
  const api = useApi();
  const { makeToast } = useToast();
  const { entity, defaultTerms, refetchEntity, entityRefetching } =
    useBorrowerDeps();
  const [loading, setLoading] = useState(false);
  const { toggleModal, isModalActive, modalState, setModalState } = useModal(
    defaultTerms[0]
  );

  const getTermDisplay = (term) => {
    if (term.default_term.term_period === 'days') return '30 Days';

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
        refetchEntity();
        toggleModal();
        makeToast('Recharge Settings Successfully Updated', 'success');
      })
      .catch(() => {
        makeToast(
          'An error occurred. Please contact Credit Key Support',
          'error'
        );
      })
      .finally(() => setLoading(false));
  };

  if (!defaultTerms?.length) return;

  return (
    <div
      className="flex flex-col divide-y gap-2 w-full"
      role={DefaultTermsDisplay.role}
    >
      {DefaultTermsDisplay && (
        <DefaultTermSettingsModal
          modalState={modalState}
          onSave={onSave}
          isModalActive={isModalActive}
          toggleModal={toggleModal}
          loading={loading}
        />
      )}
      {defaultTerms?.map((s, idx) => {
        return (
          <div
            key={idx}
            className="flex flex-col xl:flex-row gap-1 justify-between items-start xs:items-center md:items-start xl:items-center"
          >
            {entityRefetching ? (
              <Loading className="w-5 h-5 my-2" />
            ) : (
              <>
                <p className="text-sm">
                  Merchant Name:
                  <strong className="mx-1">{s.merchant_name}</strong>
                </p>
                <div className="text-sm flex items-center gap-1">
                  <p>Default Term:</p>
                  <strong className="mx-1">{getTermDisplay(s)}</strong>
                  <FontAwesomeIcon
                    className={classNames(
                      'text-primary-blue cursor-pointer hover:text-primary-blue-hover',
                      {
                        'opacity-0': s?.default_term?.term_period === 'days',
                      }
                    )}
                    icon={faPenToSquare}
                    onClick={() => {
                      setModalState(s);
                      toggleModal();
                    }}
                  />
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

DefaultTermsDisplay.role = 'default-term-display-component';
