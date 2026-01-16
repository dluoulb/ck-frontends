import React from 'react';
import { faInfoCircle, faTrashCan } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import Tooltip from '@components/Tooltip';
import useModal from '@hooks/useModal';
import DeletePmModal from './modals/DeletePmModal';

export const DeleteButton = React.forwardRef<
  HTMLDivElement,
  { payment_method: any; setLoading: (id: string) => void }
>((props, ref) => {
  const { payment_method, setLoading } = props;
  const { isModalActive, toggleModal } = useModal();

  return (
    <>
      <DeletePmModal
        isModalActive={isModalActive}
        payment_method={payment_method}
        toggleModal={toggleModal}
        setLoading={setLoading}
      />

      <div
        ref={ref}
        className={classNames(
          'sm:hidden flex items-center gap-1 border-b border-transparent max-w-max',
          payment_method?.is_default
            ? 'cursor-not-allowed text-tertiary-gray/70'
            : 'text-error hover:border-error cursor-pointer',
        )}
      >
        {!payment_method?.is_default && <FontAwesomeIcon icon={faTrashCan} className="text-xs" />}
        <div
          className="dropdown-item text-sm font-medium block w-full whitespace-nowrap text-left flex items-center gap-1"
          onClick={toggleModal}
        >
          <p>Delete Payment Method</p>
          {payment_method?.is_default && (
            <Tooltip
              tooltip_text="Default payment methods cannot be deleted. Please set a new default payment method before proceeding or
                    contact our support team for further assistance."
              trigger_class="hover:text-primary-blue cursor-pointer text-xs text-tertiary-gray/70 !border-none"
              container_class="text-center p-4 px-6 text-sm bg-secondary-blue !text-primary"
            >
              <FontAwesomeIcon icon={faInfoCircle} className="text-xs mt-0.5" />
            </Tooltip>
          )}
        </div>
      </div>
      <div ref={ref}>
        <button
          className="hidden sm:inline dropdown-item text-sm py-2 px-4 font-medium block w-full whitespace-nowrap bg-transparent text-error hover:bg-background-error text-left"
          onClick={toggleModal}
        >
          Delete Payment Method
        </button>
      </div>
    </>
  );
});
