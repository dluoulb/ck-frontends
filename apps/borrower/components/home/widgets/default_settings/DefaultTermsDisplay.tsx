import React, { useState } from 'react';
import { faPenToSquare } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

// import useModal from '../../../hooks/useModal';
import useToast from '@hooks/useToast';

// import { DefaultTermsDisplayModal } from '../../modals';
// import { loading } from '../../../store/actions/general';

export default function DefaultTermsDisplay({
  entity = {},
  // companyActions,
  defaultTerms = [],
}) {
  const [loading, setLoading] = useState(false);
  const { makeToast } = useToast();
  // const { toggleModal, isModalActive, modalState, setModalState } = useModal(
  //   [],
  //   DefaultTermsDisplay[0],
  // );

  // const updateRechargeTerm = (merchant_id, term) => {
  //   return companyActions.update(
  //     company.set(
  //       'recharge_settings',
  //       company?.recharge_settings.update(
  //         company?.recharge_settings.findIndex(
  //           (i) => i.get('merchant_id') === merchant_id,
  //         ),
  //         (item) =>
  //           item
  //             .set('default_term', term?.term)
  //             .set('default_term_period', term?.term_period),
  //       ),
  //     ),
  //   );
  // };

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
    // updateRechargeTerm(merchant_id, term)
    //   .then(() =>
    //     makeToast(
    //       'Recharge Settings Successfully Updated',
    //       'positive-green',
    //       'check-circle',
    //     ),
    //   )
    //   .catch(() =>
    //     makeToast(
    //       'An error occurred. Please contact Credit Key Support',
    //       'negative-red',
    //       ['far', 'octagon-xmark'],
    //     ),
    //   )
    //   .finally(() => dispatch(loading(false)));
  };

  if (!defaultTerms?.length) return;

  return (
    <div className="flex flex-col divide-y gap-2 w-full" role={DefaultTermsDisplay.role}>
      {/* {DefaultTermsDisplay && (
        <DefaultTermsDisplayModal
          modalState={modalState}
          onSave={onSave}
          isModalActive={isModalActive}
          toggleModal={toggleModal}
        />
      )} */}
      {defaultTerms?.map((s, idx) => {
        return (
          <div
            key={idx}
            className="flex flex-col xs:flex-row xl:flex-row gap-1 justify-between items-start xs:items-center md:items-start xl:items-center"
          >
            <p className="text-sm">
              Merchant Name:
              <strong className="mx-1">{s.merchant_name}</strong>
            </p>
            <div className="text-sm flex items-center gap-1">
              <p>
                Default Term:
                <strong className="mx-1">{getTermDisplay(s)}</strong>
              </p>
              <FontAwesomeIcon
                className={classNames(
                  'text-primary-blue cursor-pointer hover:text-primary-blue-hover',
                  {
                    'opacity-0': s?.default_term?.term_period === 'days',
                  }
                )}
                icon={faPenToSquare}
                // onClick={() => {
                //   setModalState(s);
                //   toggleModal();
                // }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

DefaultTermsDisplay.role = 'default-term-display-component';