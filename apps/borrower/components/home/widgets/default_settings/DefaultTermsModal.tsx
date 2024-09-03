import React, { useEffect, useState } from 'react';
import { faLockAlt, faPenToSquare } from '@fortawesome/pro-regular-svg-icons';
import { ListboxOption } from '@headlessui/react';
import classNames from 'classnames';

import OutlineButton from '@components/buttons/OutlineButton';
import PrimaryButton from '@components/buttons/PrimaryButton';
import { ListBox } from '@components/Dropdown';
import Loading from '@components/Loading';
import ModalWrapper from '@components/modals/ModalWrapper';

export default function DefaultTermSettingsModal({
  loading,
  onSave,
  modalState,
  isModalActive,
  toggleModal,
}) {
  const [term, setTerm] = useState(modalState?.default_term);

  const handleChange = (value) => {
    setTerm(value);
  };

  useEffect(() => {
    setTerm(modalState?.default_term);
  }, [modalState]);

  return (
    <ModalWrapper
      toggleModal={toggleModal}
      isModalActive={isModalActive}
      modalHeight="sm:max-h-recharge sm:min-h-recharge"
      header="Edit Default Terms"
      headerIcon={faPenToSquare}
    >
      <div className="text-center">
        {!modalState?.term_options ? (
          <Loading className="w-14 h-14" />
        ) : (
          <>
            <div className="my-6 space-y-8">
              <div className="space-y-2">
                <p className="text-xl font-semibold">
                  Default Terms for {modalState?.merchant_name}
                </p>
                <p>
                  Change the default term length for future in-store or
                  replenishment purchases.
                </p>
              </div>
              <div>
                <h1>Adjust Number of Months</h1>
                <ListBox
                  initialValue={modalState?.default_term?.term}
                  buttonText={term?.term}
                  handleChange={handleChange}
                  value={term}
                  optionsContainerClass="border-primary-blue-hover border-opacity-30"
                  listBoxClass="w-4/5 mx-auto my-3 rounded-md bg-secondary-blue transition ease-in-out duration-150 sm:text-sm relative"
                >
                  {modalState?.term_options?.map((op) => (
                    <ListboxOption
                      key={op.term}
                      value={op}
                      className={classNames(
                        'capitalize cursor-pointer p-2 hover:bg-secondary-blue hover:primary-blue-hover last:hover:rounded-b-md border-primary-blue-hover border-opacity-30',
                        {
                          'border-b':
                            op !==
                            modalState?.term_options[
                              modalState?.term_options.length - 1
                            ],
                        }
                      )}
                    >
                      {op.term}
                    </ListboxOption>
                  ))}
                </ListBox>
              </div>
            </div>
          </>
        )}
      </div>
      <div className="w-full mt-10 flex justify-center items-center gap-3">
        <PrimaryButton
          ariaLabel="save-default-terms-button"
          buttonText="Save"
          buttonColor="bg-primary-blue"
          hoverClass="hover:bg-primary-blue-hover"
          icon={faLockAlt}
          disabled={loading}
          isLoading={loading}
          onClick={() => onSave(modalState?.merchant_id, term)}
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
