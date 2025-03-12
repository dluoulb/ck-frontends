import React from 'react';
import CloseMultiUseVirtualCardModal from './vc_modal/CloseMultiUseVirtualCardModal';
import useModal from '@hooks/useModal';
import useVirtualCardBalance from '@apps/borrower/hooks/useVirtualCardBalance';
import Loading from '@components/Loading';
import { formatCurrency } from '@lib/utils/formatters';
import PrimaryButton from '@components/buttons/PrimaryButton';
import AddFundsModalWrapper from './vc_modal/AddFundsModalWrapper';

export default function PrepaidCardBalance({ allowCardClose }) {
  const { isModalActive, toggleModal } = useModal();
  const { isModalActive: isAddFundsActive, toggleModal: toggleAddFunds } = useModal();
  const { balance, balanceLoading } = useVirtualCardBalance();

  const getExpirationClock = (nextSweepAt) => {
    const diff = new Date(nextSweepAt).getTime() - Date.now();
    const minute = 1000 * 60;
    const hour = minute * 60;

    if (diff < minute) return <p className="text-red-600">Balance Expired</p>;
    
    const hours = diff / hour;
    if (hours >= 1) return <p>Balance expires in {Math.ceil(hours)} {hours === 1 ? 'hour' : 'hours'}</p>;

    const minutes = diff / minute;
    return <p>Balance expires in {Math.ceil(minutes)} {minutes === 1 ? 'minute' : 'minutes'}</p>;
  };

  if (balanceLoading) return <Loading />;

  return (
    <div className="relative text-base text-neutral-800 h-full min-h-36">
      <p>Current Card Balance: {formatCurrency(balance?.amount || 0)}</p>
      {getExpirationClock(balance?.next_sweep_at || new Date().toISOString())}
      <PrimaryButton
        ariaLabel="add-funds-to-virtual-card-button"
        buttonText="Add Funds"
        buttonColor="bg-primary-blue"
        hoverClass="hover:bg-primary-blue-hover"
        containerClass="w-max"
        onClick={toggleAddFunds}
      />
      {allowCardClose && <>
        <PrimaryButton
          ariaLabel="close-virtual-card-button"
          buttonText="Close virtual card"
          buttonColor="bg-red-700"
          hoverClass="hover:bg-red-900"
          containerClass="w-max absolute bottom-0 -my-1 sm:-my-2"
          onClick={toggleModal}
        />
        <CloseMultiUseVirtualCardModal
          isModalActive={isModalActive}
          toggleModal={toggleModal}
        />
      </>}
      <AddFundsModalWrapper
        isModalActive={isAddFundsActive}
        toggleModal={toggleAddFunds}
      />
    </div>
  );
};
