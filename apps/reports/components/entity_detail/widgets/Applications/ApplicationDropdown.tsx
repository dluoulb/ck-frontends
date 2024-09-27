import React from 'react';
import { ListboxOption } from '@headlessui/react';
import classNames from 'classnames';

import { ListBox } from '@components/Dropdown';
import Loading from '@components/Loading';

export default function ApplicationDropdown({
  listOptions,
  contentId,
  setContent,
}) {
  if (!listOptions) return <Loading className="w-5 md:w-7 h-5 md:h-7 px-3" />;

  const selected = listOptions.find((o) => o.id === contentId);
  const mostRecent = selected === listOptions[0];

  return (
    <div className="lg:px-2 xl:px-0">
      <div className="text-center">
        <ListBox
          initialValue={listOptions[0]?.id}
          buttonText={`${mostRecent ? 'Most Recent:' : ''} ${selected?.text}`}
          handleChange={(e) => setContent(e)}
          listBoxClass="my-3 relative capitalize bg-secondary-blue mt-1"
          value={contentId}
        >
          {listOptions.map((op) => (
            <ListboxOption
              key={op.id}
              value={op.id}
              className={classNames(
                'text-sm capitalize cursor-pointer p-2 px-3 hover:bg-secondary-blue hover:text-primary-blue-hover last:hover:rounded-b-md border-primary-blue-hover/20',
                { 'border-b': op !== listOptions[listOptions.length - 1] }
              )}
            >
              {op.text}
            </ListboxOption>
          ))}
        </ListBox>
      </div>
      <div className="layer" />
    </div>
  );
}
