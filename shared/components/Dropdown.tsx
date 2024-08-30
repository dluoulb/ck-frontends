import React, { Fragment } from 'react';
import { faAngleDown } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  Menu,
  MenuButton,
  MenuItems,
  Transition,
} from '@headlessui/react';
import classNames from 'classnames';

export const Dropdown = ({ button, children }) => {
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <MenuButton>{button}</MenuButton>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="z-10 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">{children}</div>
        </MenuItems>
      </Transition>
    </Menu>
  );
};

export const ListBox = ({
  initialValue,
  value,
  buttonText,
  handleChange,
  listBoxClass,
  optionsContainerClass,
  children,
}) => {
  return (
    <Listbox as="div" value={value || initialValue} onChange={handleChange}>
      <div className={`${listBoxClass} relative rounded-lg text-sm`}>
        <ListboxButton className="relative w-full cursor-pointer py-2 px-4 text-left z-20">
          <span className="block truncate capitalize pl-2 pr-6">
            {buttonText}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
            <FontAwesomeIcon icon={faAngleDown} className="mx-4" />
          </span>
        </ListboxButton>

        <ListboxOptions
          className={classNames(
            'text-sm absolute z-10 w-full overflow-auto rounded-b-md bg-white border shadow-lg',
            optionsContainerClass
          )}
        >
          {children}
        </ListboxOptions>
      </div>
    </Listbox>
  );
};
