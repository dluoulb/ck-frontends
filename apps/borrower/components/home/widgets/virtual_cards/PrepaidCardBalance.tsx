import React from 'react';
import CloseMultiUseVirtualCardModal from './vc_modal/CloseMultiUseVirtualCardModal';
import useModal from '@hooks/useModal';
import useVirtualCardBalance from '@apps/borrower/hooks/useVirtualCardBalance';
import Loading from '@components/Loading';
import { formatCurrency } from '@lib/utils/formatters';

export default function PrepaidCardBalance({ allowCardClose }) {
  const { isModalActive, toggleModal } = useModal();
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

  if (balanceLoading) return <Loading />

  return (
    <div className="relative text-base text-neutral-800 h-full min-h-32">
      <p>Current Card Balance: {formatCurrency(balance?.amount || 0)}</p>
      {getExpirationClock(balance?.next_sweep_at || new Date().toISOString())}
      <button
        type="button"
        className="mt-2 flex tracking-wider transition duration-150 ease-in-out bg-primary-blue hover:bg-primary-blue-hover text-base text-white rounded-lg px-2 py-1"
        onClick={() => alert('stub')}
      >
        Add Funds
      </button>
      {allowCardClose && <>
        <button
          type="button"
          className="absolute bottom-0 flex tracking-wider transition duration-150 ease-in-out bg-red-700 hover:bg-red-900 text-sm text-white rounded-lg px-2 py-1"
          onClick={toggleModal}
        >
          Close virtual card
        </button>
        <CloseMultiUseVirtualCardModal
          isModalActive={isModalActive}
          toggleModal={toggleModal}
        />
      </>}
    </div>
  );
};
