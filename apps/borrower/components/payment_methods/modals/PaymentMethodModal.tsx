import { useState } from 'react';
import {
  ListboxOption,
  Popover,
  PopoverButton,
  PopoverPanel,
} from '@headlessui/react';
import classNames from 'classnames';
import Image from 'next/image';

import { ListBox } from '@components/Dropdown';
import { useBorrowerDeps } from '@contexts/BorrowerContext';
import { useEntity } from '@contexts/EntityContext';
import useDropdown from '@hooks/useDropdown';
import check from '@lib/images/check.gif';
import BankForm from '../forms/BankForm';
import CreditCardForm from '../forms/CreditCardForm';
import Plaid from '../Plaid';

// which type of PMs are available to create
const listOptions = [
  { id: 'ach', text: 'ACH Bank Account' },
  { id: 'cc', text: 'Credit Card' },
];

export default function PaymentMethodModal({
  hasAlert,
  setHasAlert,
  next,
  toggleModal,
}) {
  const [usePlaid, setUsePlaid] = useState(process.env.NEXT_PUBLIC_PLAID_CREATE_PMS === 'true');
  const { entity } = useEntity();
  const { orders } = useBorrowerDeps();

  const hasPi4Orders =
    orders?.filter(
      (order) =>
        order.entity_type === 'account' && order.product.status === 'active'
    ).size > 0;

  const defaultContentId = entity?.type === 'company' ? 'ach' : 'cc';
  const { contentId, setContent } = useDropdown(defaultContentId);

  const BankComponent = () => {
    if (usePlaid) {
      return (
        <Plaid
          hasAlert={hasAlert}
          next={next}
          toggleModal={toggleModal}
          setHasAlert={setHasAlert}
          setUsePlaid={setUsePlaid}
        />
      );
    } else {
      return (
        <BankForm
          hasAlert={hasAlert}
          next={next}
          toggleModal={toggleModal}
          setHasAlert={setHasAlert}
        />
      );
    }
  };
  const ConnectBankHeader = () => {
    if (contentId !== 'ach') return null;

    if (!usePlaid) {
      return (
        <Popover className="relative">
          <PopoverButton className="text-xs text-center text-primary-blue underline cursor-pointer">
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
      <div>
        <div className="text-center">
          <div className="my-4 sm:my-2">
            <p className="text-xl sm:text-2xl font-bold">New Payment Method</p>
            <div className="my-1 sm:my-2">
              <p className="text-sm sm:text-base">
                Please confirm your{' '}
                {contentId === 'ach' ? 'business bank' : 'credit card'} details.
              </p>
              {<ConnectBankHeader />}
            </div>
          </div>

          {entity?.type === 'company' && hasPi4Orders && (
            <div className="mt-3 mb-6">
              <p className="text-sm text-secondary-gray my-2">
                Select Payment Method Type
              </p>
              <ListBox
                initialValue={defaultContentId}
                value={listOptions[0]}
                buttonText={
                  contentId === 'ach'
                    ? listOptions[0].text
                    : listOptions[1].text
                }
                handleChange={setContent}
                listBoxClass="!w-full sm:!w-4/5 mx-auto rounded-md bg-secondary-blue transition ease-in-out duration-150 text-sm relative"
              >
                {listOptions.map((op) => (
                  <ListboxOption
                    key={op.id}
                    value={op.id}
                    className={classNames(
                      'capitalize cursor-pointer text-sm px-3 py-2 hover:bg-secondary-blue hover:text-primary-blue-hover last:hover:rounded-b-md',
                      {
                        'border-b': op !== listOptions[listOptions.length - 1],
                      }
                    )}
                  >
                    {op.text}
                  </ListboxOption>
                ))}
              </ListBox>
            </div>
          )}
        </div>
        <div className="layer" />
      </div>

      <section>
        {contentId === 'ach' ? (
          <BankComponent />
        ) : (
          <div className="sm:mx-12">
            <CreditCardForm toggleModal={toggleModal} />
          </div>
        )}
      </section>
    </>
  );
}
