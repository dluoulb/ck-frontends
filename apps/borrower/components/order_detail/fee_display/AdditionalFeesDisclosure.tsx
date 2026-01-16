import React from 'react';
import { faAngleUp } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';

import FeesDisplay from './FeeDisplay';

export default function AdditionalFeesDisclosure({ order }) {
  return (
    <div className="w-full mb-4">
      <div className="mx-auto w-full">
        <Disclosure>
          {({ open }) => (
            <>
              <DisclosureButton className="flex w-full justify-between bg-secondary-blue px-6 py-4 text-left font-bold text-primary-blue-hover hover:bg-blue-100 transition duration-500">
                <span>View Fees Breakdown</span>
                <FontAwesomeIcon
                  icon={faAngleUp}
                  className={`${
                    open ? 'rotate-180 transform' : ''
                  } h-5 w-5 text-primary-blue-hover font-bold`}
                />
              </DisclosureButton>
              <DisclosurePanel className="text-sm">
                <FeesDisplay order={order} open={open} />
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}
