import React from 'react';
import { faCircleCheck } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useBorrowerDeps } from '@contexts/BorrowerContext';
import useApi from '@hooks/useApi';
import useToast from '@hooks/useToast';
import { updatePaymentMethod } from '@lib/actions/payment_methods';

export const DefaultButton = React.forwardRef<
  HTMLButtonElement,
  { payment_method: any; setLoading: (id: string) => void }
>((props, ref) => {
  const api = useApi();
  const { payment_method, setLoading } = props;
  const { makeToast } = useToast();
  const { refetchPaymentMethods } = useBorrowerDeps();

  const setDefaultPayment = async (payment_method) => {
    const updatedPM = { ...payment_method, is_default: true };

    setLoading(payment_method?.id);
    updatePaymentMethod(api, updatedPM)
      .then(() => {
        refetchPaymentMethods();
        makeToast('New Default Payment Method Set!', 'success');
      })
      .catch(() => {
        makeToast(
          'An error occurred. Please try again or contact our support team.',
          'error'
        );
        setLoading(null);
      })
      .finally(() => {
        setLoading(null);
      });
  };

  return (
    <>
      <div className="sm:hidden flex items-center gap-1 mt-4 text-primary-blue border-b border-transparent hover:border-primary-blue max-w-max">
        <FontAwesomeIcon icon={faCircleCheck} className="text-xs" />
        <button
          className="dropdown-item text-sm font-medium block w-full whitespace-nowrap text-left"
          onClick={() => setDefaultPayment(payment_method)}
          ref={ref}
        >
          Set As Default
        </button>
      </div>
      <button
        className="hidden sm:inline dropdown-item text-sm py-2 px-4 font-medium block w-full whitespace-nowrap bg-transparent text-primary-blue hover:bg-secondary-blue text-left"
        onClick={() => setDefaultPayment(payment_method)}
        ref={ref}
      >
        Set As Default
      </button>
    </>
  );
});
