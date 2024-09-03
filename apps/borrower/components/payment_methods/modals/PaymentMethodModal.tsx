import {
  ListboxOption,
  Popover,
  PopoverButton,
  PopoverPanel,
} from '@headlessui/react';
import Image from 'next/image';

import { ListBox } from '@components/Dropdown';
import { useBorrowerDeps } from '@contexts';
import useDropdown from '@hooks/useDropdown';
import check from '@lib/images/check.gif';
import BankForm from '../forms/BankForm';

// import { BankForm, CreditCardForm } from '../../forms';

export default function PaymentMethodModal({
  hasAlert,
  setHasAlert,
  next,
  toggleModal,
}) {
  const { entity, orders } = useBorrowerDeps();

  const hasPi4Orders =
    orders?.filter(
      (order) =>
        order.entity_type === 'account' && order.product.status === 'active'
    ).size > 0;

  const defaultContentId = entity?.type === 'company' ? 'ach' : 'cc';
  const { contentId, setContent } = useDropdown(defaultContentId);
  const listOptions = [
    { id: 'ach', text: 'ACH Bank Account' },
    { id: 'cc', text: 'Credit Card' },
  ];

  return (
    <>
      <div>
        <div className="text-center">
          <div className="my-3">
            <p className="text-2xl font-bold">New Payment Method</p>
            <div className="my-2">
              <p>
                Please confirm your{' '}
                {contentId === 'ach' ? 'business bank' : 'credit card'} details.
              </p>
              {contentId === 'ach' && (
                <Popover className="relative">
                  <PopoverButton className="text-xs text-center text-primary-blue underline cursor-pointer">
                    Need Help?
                  </PopoverButton>

                  <PopoverPanel className="absolute left-20 z-10 bg-secondary-blue text-white p-4 rounded-md w-80 h-50">
                    <Image
                      src={check}
                      alt="example check"
                      className="mx-auto"
                    />
                  </PopoverPanel>
                </Popover>
              )}
            </div>
          </div>

          {entity?.type === 'company' && hasPi4Orders && (
            <ListBox
              initialValue={defaultContentId}
              value={listOptions[0]}
              buttonText={
                contentId === 'ach' ? listOptions[0].text : listOptions[1].text
              }
              handleChange={setContent}
              listBoxClass="w-4/5 xs:w-1/2 my-3 relative"
              optionsContainerClass=""
            >
              {listOptions.map((op) => (
                <ListboxOption
                  key={op.id}
                  value={op.id}
                  className="cursor-pointer p-2 hover:bg-gray-500 hover:text-white last:hover:rounded-b-md"
                >
                  {op.text}
                </ListboxOption>
              ))}
            </ListBox>
          )}
        </div>
        <div className="layer" />
      </div>
      <section>
        {contentId === 'ach' ? (
          <BankForm
            hasAlert={hasAlert}
            // isLoading={isLoading}
            next={next}
            toggleModal={toggleModal}
            setHasAlert={setHasAlert}
          />
        ) : (
          <div />
          // <CreditCardForm
          //   hasAlert={hasAlert}
          //   next={next}
          //   toggleModal={toggleModal}
          // />
        )}
      </section>
    </>
  );
}
