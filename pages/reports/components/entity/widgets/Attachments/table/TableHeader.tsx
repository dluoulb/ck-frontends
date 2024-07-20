import React from 'react';
import GlobalFilter from '@components/GlobalFilter';
import classNames from 'classnames';
import { startCase } from 'lodash';

const statusTabs = [
  {
    name: 'all',
    filter_value: '',
  },
  {
    name: 'Bank Statements',
    filter_value: 'bank_statements',
  },
  {
    name: 'Adverse Action',
    filter_value: [
      'manual_adverse_action_notice',
      'adverse_action_reason_for_denial',
    ],
  },
  {
    name: 'Underwriting',
    filter_value: 'underwriting_other',
  },
  {
    name: 'Other',
    filter_value: 'misc',
  },
];

export default function TableHeader({ tableInstance, active, setActive }) {
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
                    'inline-flex p-4 rounded-t-lg border-b-2 border-transparent',
                    active === s.name
                      ? 'text-primary-blue border-primary-blue'
                      : 'hover:text-primary-blue-hover hover:bg-secondary-blue'
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
