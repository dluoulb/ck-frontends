import { useState } from 'react';
import { faAngleDown } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react';
import classNames from 'classnames';
import clsx from 'clsx';

const people = [
  { id: 1, name: 'Tom Cook' },
  { id: 2, name: 'Wade Cooper' },
  { id: 3, name: 'Tanya Fox' },
  { id: 4, name: 'Arlene Mccoy' },
  { id: 5, name: 'Devon Webb' },
];

export default function Example({
  value,
  initialValue,
  buttonText,
  handleChange,
  listBoxClass,
}) {
  const [selected, setSelected] = useState(people[1]);

  return (
    <Listbox as="div" value={value || initialValue} onChange={handleChange}>
      <ListboxButton
        className={classNames(
          'relative block w-full rounded-lg py-1.5 pr-8 pl-3 text-left text-sm/6 focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25',
          listBoxClass
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
        className={clsx(
          'w-[var(--button-width)] rounded-b-md border bg-white p-1 shadow-lg [--anchor-gap:var(--spacing-1)] focus:outline-none',
          'transition duration-100 ease-in data-[leave]:data-[closed]:opacity-0'
        )}
      >
        {people.map((person) => (
          <ListboxOption
            key={person.name}
            value={person}
            className="group flex cursor-default items-center gap-2 rounded-lg py-1.5 px-3 select-none data-[focus]:bg-secondary-blue"
          >
            <div className="text-sm/6 cursor-pointer">{person.name}</div>
          </ListboxOption>
        ))}
      </ListboxOptions>
    </Listbox>
  );
}
