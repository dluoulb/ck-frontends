import { useState } from 'react';
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react';
import Image from 'next/image';

import { useEntity } from '@contexts/EntityContext';
import { useUser } from '@contexts/UserContext';
import { plaidEnabled } from '@lib/constants/SiteVariables';
import check from '@lib/images/check.gif';
import FullStory from '@lib/utils/fullstory';
import BankForm from '../forms/BankForm';
import Plaid from '../Plaid';

export default function VcFlowDefaultPaymentMethodModal({
  hasAlert,
  setHasAlert,
  next,
  toggleModal,
}) {
  const [usePlaid, setUsePlaid] = useState(plaidEnabled);
  const { entity } = useEntity();
  const { user } = useUser();

  const handleSubmit = () => {
    const fullstory = new FullStory();
    fullstory.newPaymentMethodEvent(user?.id, entity?.id);

    next();
  };

  const BankComponent = () => {
    if (usePlaid) {
      return (
        <Plaid
          hasAlert={hasAlert}
          next={handleSubmit}
          toggleModal={toggleModal}
          setHasAlert={setHasAlert}
          setUsePlaid={setUsePlaid}
          createVcFlow={true}
        />
      );
    } else {
      return (
        <BankForm
          hasAlert={hasAlert}
          next={handleSubmit}
          toggleModal={toggleModal}
          setHasAlert={setHasAlert}
          createVcFlow={true}
          submitButtonText="Next"
        />
      );
    }
  };
  const ConnectBankHeader = () => {
    if (!usePlaid) {
      return (
        <Popover className="relative">
          <PopoverButton className="text-xs text-left text-primary-blue underline cursor-pointer">
            Need Help?
          </PopoverButton>

          <PopoverPanel className="absolute left-20 z-10 bg-secondary-blue text-white p-4 rounded-md w-80 h-50">
            <Image src={check} alt="example check" className="mx-auto" />
          </PopoverPanel>
        </Popover>
      );
    }
  };

  return (
    <>
      <div className="mb-5">
        <div className="my-4 sm:my-2">
          <p className="text-lg font-semibold">Please add default repayment method</p>
          <div className="my-1 sm:my-2 text-left">
            <p className="text-sm sm:text-base">
              This is the bank account where Credit Key will deduct funds according to the payment
              schedule agreed to for each purchase.
            </p>
            {<ConnectBankHeader />}
          </div>
        </div>
      </div>

      <section>
        <BankComponent />
      </section>
    </>
  );
}
