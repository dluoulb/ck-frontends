import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ListboxOption } from '@headlessui/react';
import classNames from 'classnames';

import { ListBox } from '@components/Dropdown';
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
      newFilter = { id: filterType, value: tab.filter_value };
    }
    table.setColumnFilters([newFilter]);
  };

  return (
    <div
      className={classNames(
        'border-b border-primary-gray-border !z-50',
        headerClass
      )}
    >
      <ul className="flex flex-col-reverse xl:flex-row justify-between xl:items-center -mb-px text-sm text-center">
        <div className="lg:px-2 xl:px-0 inline mid:hidden">
          <p className="pb-2 px-2 text-left text-sm font-medium border-b border-primary-gray-border">
            Filter by type:
          </p>
          <div className="text-center">
            <ListBox
              buttonText={active}
              handleChange={(e) => {
                setActive(e.name);
                handleTabFiltering(e);
              }}
              listBoxClass="my-3 relative capitalize bg-secondary-blue mt-1"
            >
              {statusTabs.map((tab) => (
                <ListboxOption
                  key={tab.name}
                  value={tab}
                  className={classNames(
                    'text-sm capitalize cursor-pointer p-2 px-3 hover:bg-secondary-blue hover:text-primary-blue-hover last:hover:rounded-b-md border-primary-blue-hover/20 flex items-center gap-2',
                    { 'border-b': tab !== statusTabs[statusTabs.length - 1] }
                  )}
                >
                  {tab.icon && <FontAwesomeIcon icon={tab.icon} />}
                  {tab.name}
                </ListboxOption>
              ))}
            </ListBox>
          </div>
          <div className="layer" />
        </div>
        <div className="hidden mid:flex justify-start overflow-x-scroll">
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
                  <span className="capitalize">{s.name}</span>
                </div>
              </li>
            );
          })}
        </div>
        <div className="xl:min-w-64 w-full xl:w-auto my-2 xl:my-0">
          <GlobalFilter
            defaultPlaceholder="Search"
            containerClass="w-full"
            inputClass="w-full"
            table={table}
          />
        </div>
      </ul>
    </div>
  );
}
