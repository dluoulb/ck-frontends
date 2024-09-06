import React from 'react';
import { faAngleUp } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';

import Schedule from './Schedule';

export default function PaymentScheduleDisclosure({ order }) {
  return (
    <div className="w-full my-4">
      <div className="mx-auto w-full">
        <Disclosure defaultOpen={true}>
          {({ open }) => (
            <>
              <DisclosureButton className="flex w-full justify-between bg-secondary-blue px-6 py-4 text-left font-bold text-primary-blue-hover hover:bg-blue-100 transition duration-500">
                <span>View Payment Schedule</span>
                <FontAwesomeIcon
                  icon={faAngleUp}
                  className={`${
                    open ? 'rotate-180 transform' : ''
                  } h-5 w-5 text-primary-blue-hover font-bold`}
                />
              </DisclosureButton>
              <DisclosurePanel className="text-sm">
                <Schedule order={order} open={open} />
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}
