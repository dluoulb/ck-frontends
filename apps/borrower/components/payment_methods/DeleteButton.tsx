import React from 'react';

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
      <div ref={ref}>
        <button
          className="dropdown-item text-sm py-2 px-4 font-medium block w-full whitespace-nowrap bg-transparent text-error hover:bg-background-error text-left"
          onClick={toggleModal}
        >
          Delete Payment Method
        </button>
      </div>
    </>
  );
});
