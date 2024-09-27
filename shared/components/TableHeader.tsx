import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { filterFns } from '@tanstack/react-table';
import classNames from 'classnames';
import { startCase } from 'lodash';

import GlobalFilter from '@components/orders_table/GlobalFilter';

export default function TableHeader({
  table,
  statusTabs = [],
  active = '',
  setActive = (tag) => {},
  tabClass = '',
  headerClass = '',
  filterType = '',
}) {
  const handleTabFiltering = (tab) => {
    let newFilter;
    const hasPastDueTab = statusTabs.some((tab) => tab.name === 'past due');

    if (hasPastDueTab && tab.name === 'past due') {
      newFilter = { id: 'isPastDue', value: true };
    } else {
      newFilter = {
        id: filterType,
        value: Array.isArray(tab.filter_value)
          ? tab.filter_value
          : [tab.filter_value],
      };
    }
    table.setColumnFilters([newFilter]);
  };

  return (
    <div
      className={classNames('border-b border-primary-gray-border', headerClass)}
    >
      <ul className="flex justify-between md:items-center -mb-px text-sm text-center">
        <div className="hidden lg:flex justify-between md:justify-start overflow-x-scroll">
          {statusTabs.map((s, idx) => {
            return (
              <li
                className="mr-2 cursor-pointer"
                key={idx}
                onClick={() => {
                  setActive(s.name);
                  handleTabFiltering(s);
                }}
              >
                <div
                  className={classNames(
                    'inline-flex items-center p-4 rounded-t-lg border-b-2',
                    active === s.name
                      ? s.name === 'past due'
                        ? 'text-error !border-error'
                        : 'text-primary-blue !border-primary-blue'
                      : 'hover:text-primary-blue',
                    tabClass,
                    { 'gap-2': s.icon }
                  )}
                >
                  {s.icon && <FontAwesomeIcon icon={s.icon} />}
                  <span>{startCase(s.name)}</span>
                </div>
              </li>
            );
          })}
        </div>
        <div className="md:min-w-64 w-full lg:w-auto my-2 lg:my-0">
          <GlobalFilter
            defaultPlaceholder="Search Documents"
            containerClass="w-full"
            inputClass="w-full"
            table={table}
          />
        </div>
      </ul>
    </div>
  );
}
