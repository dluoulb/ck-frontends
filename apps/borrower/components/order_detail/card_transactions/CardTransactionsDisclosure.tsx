import React from 'react';
import { faAngleUp } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';

import CardTransactions from './CardTransactions';

export default function CardTransactionsDisclosure({ order }) {
  if (order.card_transactions.length < 1) return null;

  return (
    <div className="w-full my-4">
      <div className="mx-auto w-full">
        <Disclosure defaultOpen={false}>
          {({ open }) => (
            <>
              <DisclosureButton className="flex w-full justify-between bg-secondary-blue px-6 py-4 text-left font-bold text-primary-blue-hover hover:bg-blue-100 transition duration-500">
                <span>View Transactions</span>
                <FontAwesomeIcon
                  icon={faAngleUp}
                  className={`${
                    open ? 'rotate-180 transform' : ''
                  } h-5 w-5 text-primary-blue-hover font-bold`}
                />
              </DisclosureButton>
              <DisclosurePanel className="text-sm">
                <CardTransactions order={order} />
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}
