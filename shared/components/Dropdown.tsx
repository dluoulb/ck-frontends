import { Fragment } from 'react';
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
  initialValue = '',
  value = '',
  buttonText = '',
  listBoxClass = '',
  handleChange,
  children,
}: {
  initialValue?: string;
  value?: any;
  buttonText?: string;
  listBoxClass?: string;
  handleChange: (value: any) => void;
  children: React.ReactNode;
}) => {
  return (
    <Listbox as="div" value={value || initialValue} onChange={handleChange}>
      <ListboxButton
        className={classNames(
          'relative block w-full font-medium rounded-lg py-1.5 pr-8 pl-3 text-left text-sm/6 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
          listBoxClass,
        )}
      >
        {buttonText}
        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
          <FontAwesomeIcon icon={faAngleDown} className="mx-4" />
        </span>
      </ListboxButton>
      <ListboxOptions
        anchor="bottom"
        transition
        className="w-[var(--button-width)] z-50 rounded-md border bg-white p-1 shadow-lg [--anchor-gap:var(--spacing-1)] focus:outline-none transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0 !p-0 !max-h-64 overflow-y-scroll"
      >
        {children}
      </ListboxOptions>
    </Listbox>
  );
};
