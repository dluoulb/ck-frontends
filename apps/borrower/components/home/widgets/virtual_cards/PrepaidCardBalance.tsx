import React from 'react';
import CloseMultiUseVirtualCardModal from './vc_modal/CloseMultiUseVirtualCardModal';
import useModal from '@hooks/useModal';
import useVirtualCardBalance from '@apps/borrower/hooks/useVirtualCardBalance';
import Loading from '@components/Loading';
import { formatCurrency } from '@lib/utils/formatters';
import PrimaryButton from '@components/buttons/PrimaryButton';
import AddFundsModalWrapper from './vc_modal/AddFundsModalWrapper';
import AddFundsMessage from './AddFundsMessage';
import { faCirclePlus } from '@fortawesome/pro-regular-svg-icons';
import FundsExpirationMessage from './FundsExpirationMessage';
import { useEntity } from '@contexts/EntityContext';
import { useUser } from '@contexts/UserContext';
import FullStory from '@lib/utils/fullstory';

export default function PrepaidCardBalance({ allowCardClose }) {
  const { isModalActive, toggleModal } = useModal();
  const { isModalActive: isAddFundsActive, toggleModal: toggleAddFunds } = useModal();
  const { balance, balanceLoading } = useVirtualCardBalance();
  const minute = 1000 * 60;
  const hour = minute * 60;
  const { entity } = useEntity();
  const { user } = useUser();

  const displayExpirationClock = () => {
    if (!balance?.next_sweep_at) return <AddFundsMessage />
    const diff = new Date(balance?.next_sweep_at).getTime() - Date.now();

    if (diff < minute) {
      if (balance?.amount) return <FundsExpirationMessage />
      
      return <AddFundsMessage />;
    }
    
    const hours = diff / hour;
    if (hours >= 1) return <FundsExpirationMessage duration={`${Math.ceil(hours)} ${hours === 1 ? 'hour' : 'hours'}`} />;

    const minutes = diff / minute;
    return <FundsExpirationMessage duration={`${Math.ceil(minutes)} ${minutes === 1 ? 'minute' : 'minutes'}`} />;
  };

  const displayCardBalance = () => {
    return formatCurrency(balance?.amount || 0)
  };

  const handleAddFunds = () => {
    const fullstory = new FullStory();
    fullstory.initiateAddFundsEvent(user?.id, entity?.id);
    toggleAddFunds();
  };

  if (balanceLoading) return <Loading />;

  return (
    <>
      <div className="relative text-base text-neutral-800 h-full min-h-36 bg-white rounded-lg p-5 shadow-lg shadow-slate-400 grid gap-y-4">
        <div className="flex justify-between xl:text-xl">
          <span className="font-semibold">Amount on Card: </span><span className="font-bold">{displayCardBalance()}</span>
        </div>
        {displayExpirationClock()}
        <PrimaryButton
          ariaLabel="add-funds-to-virtual-card-button"
          icon={faCirclePlus}
          buttonText="Add Funds to Card"
          buttonColor="bg-primary-blue"
          hoverClass="hover:bg-primary-blue-hover"
          textSize="text-md xl:text-xl"
          onClick={handleAddFunds}
        />
        {allowCardClose && <>
          <PrimaryButton
            ariaLabel="close-virtual-card-button"
            buttonText="Close Credit Key Card"
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
      </div>
      <AddFundsModalWrapper
        isModalActive={isAddFundsActive}
        toggleModal={toggleAddFunds}
      />
    </>
  );
};
