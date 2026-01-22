import React, { useEffect, useState } from 'react';
import { faLockAlt, faPenToSquare } from '@fortawesome/pro-regular-svg-icons';
import { Field, ListboxOption } from '@headlessui/react';
import classNames from 'classnames';

import OutlineButton from '@components/buttons/OutlineButton';
import PrimaryButton from '@components/buttons/PrimaryButton';
import { ListBox } from '@components/Dropdown';
import Loading from '@components/Loading';
import ModalWrapper from '@components/modals/ModalWrapper';
import { getTermLabel } from '@lib/utils/formatters';

export default function DefaultTermSettingsModal({
  loading,
  onSave,
  modalState,
  isModalActive,
  toggleModal,
  allMerchants = [],
}) {
  const isEditMode = modalState !== null;
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [term, setTerm] = useState(modalState?.default_term);

  const handleMerchantChange = (merchant) => {
    setSelectedMerchant(merchant);
    setTerm(null);
  };

  const handleTermChange = (value) => {
    setTerm(value);
  };

  useEffect(() => {
    if (modalState !== null) {
      setSelectedMerchant(modalState);
      setTerm(modalState?.default_term);
    } else {
      setSelectedMerchant(null);
      setTerm(null);
    }
  }, [modalState]);

  const currentMerchant = isEditMode ? modalState : selectedMerchant;
  const isSaveDisabled = loading || !currentMerchant || !term;

  return (
    <ModalWrapper
      toggleModal={toggleModal}
      isModalActive={isModalActive}
      modalHeight="sm:max-h-recharge sm:min-h-recharge"
      header={isEditMode ? 'Edit Default Terms' : 'Add Default Terms'}
      headerIcon={faPenToSquare}
    >
      {!allMerchants?.length ? (
        <Loading className="w-14 h-14" />
      ) : (
        <>
          <div className="my-6 space-y-4">
            <div className="space-y-2 text-center">
              <p className="text-xl font-semibold">
                {isEditMode
                  ? `Default Terms for ${modalState?.merchant_name}`
                  : 'Select Merchant and Default Term'}
              </p>
              <p>{isEditMode ? 'Change' : 'Set'} the default term length for future purchases.</p>
            </div>

            {!isEditMode && (
              <>
                <h1 className="font-medium text-center">Select Merchant</h1>
                <Field disabled={loading}>
                  <ListBox
                    buttonText={selectedMerchant?.merchant_name || 'Select a merchant...'}
                    handleChange={handleMerchantChange}
                    value={selectedMerchant}
                    listBoxClass={classNames(
                      '!w-4/5 mx-auto my-3 rounded-md transition ease-in-out duration-150 sm:text-sm relative',
                      loading ? 'bg-primary-gray-border cursor-not-allowed' : 'bg-secondary-blue',
                    )}
                  >
                    {allMerchants?.map((merchant) => (
                      <ListboxOption
                        key={merchant.merchant_id}
                        value={merchant}
                        className={classNames(
                          'capitalize cursor-pointer text-sm px-3 py-2 hover:bg-secondary-blue hover:text-primary-blue-hover last:hover:rounded-b-md',
                          {
                            'border-b': merchant !== allMerchants[allMerchants.length - 1],
                          },
                        )}
                      >
                        {merchant.merchant_name}
                      </ListboxOption>
                    ))}
                  </ListBox>
                </Field>
              </>
            )}

            {currentMerchant && (
              <>
                <h1 className="font-medium text-center">Adjust Number of Months</h1>
                <Field disabled={loading}>
                  <ListBox
                    initialValue={currentMerchant?.default_term?.term}
                    buttonText={getTermLabel(term) || 'Select a term...'}
                    handleChange={handleTermChange}
                    value={term}
                    listBoxClass={classNames(
                      '!w-4/5 mx-auto my-3 rounded-md transition ease-in-out duration-150 sm:text-sm relative',
                      loading ? 'bg-primary-gray-border cursor-not-allowed' : 'bg-secondary-blue',
                    )}
                  >
                    {currentMerchant?.term_options?.map((op) => (
                      <ListboxOption
                        key={`${op.term}-${op.term_period}`}
                        value={op}
                        className={classNames(
                          'capitalize cursor-pointer text-sm px-3 py-2 hover:bg-secondary-blue hover:text-primary-blue-hover last:hover:rounded-b-md',
                          {
                            'border-b':
                              op !==
                              currentMerchant?.term_options[
                                currentMerchant?.term_options.length - 1
                              ],
                          },
                        )}
                      >
                        {getTermLabel(op)}
                      </ListboxOption>
                    ))}
                  </ListBox>
                </Field>
              </>
            )}
          </div>
        </>
      )}
      <div className="w-full mt-10 flex justify-center items-center gap-3">
        <PrimaryButton
          ariaLabel="save-default-terms-button"
          buttonText="Save"
          buttonColor="bg-primary-blue"
          hoverClass="hover:bg-primary-blue-hover"
          icon={faLockAlt}
          disabled={isSaveDisabled}
          isLoading={loading}
          onClick={() => onSave(currentMerchant?.merchant_id, term)}
        />
        <OutlineButton
          ariaLabel="Close"
          buttonText="Cancel"
          buttonColor="border-primary-blue text-primary-blue"
          hoverClass=" hover:text-primary-blue-hover hover:border-primary-blue-hover"
          onClick={toggleModal}
          disabled={loading}
        />
      </div>
    </ModalWrapper>
  );
}

DefaultTermSettingsModal.role = 'default-term-settings-modal';
