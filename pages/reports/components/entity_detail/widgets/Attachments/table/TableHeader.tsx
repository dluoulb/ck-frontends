import React from 'react';
import GlobalFilter from '@components/GlobalFilter';
import classNames from 'classnames';
import { startCase } from 'lodash';

export default function TableHeader({
  tableInstance,
  statusTabs = [],
  active = '',
  setActive = (tag) => {},
}) {
  const {
    state: { globalFilter },
    setGlobalFilter,
    setFilter,
  } = tableInstance;

  return (
    <div className="border-b border-primary-border-gray">
      <ul className="flex justify-between md:items-center -mb-px text-sm text-center">
        <div className="hidden lg:flex justify-between md:justify-start overflow-x-scroll">
          {statusTabs.map((s, idx) => {
            return (
              <li
                className="mr-2 cursor-pointer"
                key={idx}
                onClick={() => {
                  setActive(s.name);
                  setFilter('file_type', s.filter_value);
                }}
              >
                <div
                  className={classNames(
                    'inline-flex p-4 rounded-t-lg border-b-2',
                    active === s.name
                      ? 'text-primary-blue border-primary-blue'
                      : 'hover:text-primary-blue hover:border-primary-blue'
                  )}
                >
                  <span>{startCase(s.name)}</span>
                </div>
              </li>
            );
          })}
        </div>
        <div className="md:min-w-64 w-full lg:w-auto my-2 lg:my-0">
          <GlobalFilter
            globalFilter={globalFilter}
            setGlobalFilter={setGlobalFilter}
            defaultPlaceholder="Search Documents"
            containerClass="w-full"
            inputClass="w-full"
          />
        </div>
      </ul>
    </div>
  );
}
