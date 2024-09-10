import { faPlus } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import classNames from 'classnames';

import { useEntity } from '@contexts/EntityContext';
import AddUserForm from './AddUserForm';

export default function AddNewUser() {
  const { entity } = useEntity();

  return (
    <div className="w-full my-2">
      <div className="mx-auto w-full rounded-2xl">
        <Disclosure>
          {({ open, close }) => (
            <>
              <DisclosureButton className="flex w-full justify-between rounded-lg bg-background-success px-4 py-2 text-left text-sm font-medium text-success hover:bg-success/30 focus:outline-none focus-visible:ring focus-visible:ring-success/50">
                <span>Add New Purchaser</span>
                <FontAwesomeIcon
                  icon={faPlus}
                  className={classNames(
                    'h-5 w-5 text-success transition duration-500',
                    {
                      'rotate-45 transform': open,
                    }
                  )}
                />
              </DisclosureButton>
              <DisclosurePanel className="px-8 pb-2 pt-4 text-sm text-gray-500 transition duration-500">
                <p className="text-sm font-medium text-tertiary-gray">
                  Please provide your purchaser user's contact information. All
                  fields are required.
                </p>
                <AddUserForm company={entity} close={close} />
              </DisclosurePanel>
            </>
          )}
        </Disclosure>
      </div>
    </div>
  );
}
