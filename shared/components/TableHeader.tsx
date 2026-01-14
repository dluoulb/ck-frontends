import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ListboxOption } from '@headlessui/react';
import classNames from 'classnames';

import { ListBox } from '@components/Dropdown';
import { useEntity } from '@contexts/EntityContext';
import { useUser } from '@contexts/UserContext';
import useApi from '@hooks/useApi';
import useToast from '@hooks/useToast';
import { exportOrders } from '@lib/actions/orders';
import PrimaryButton from './buttons/PrimaryButton';

export default function TableHeader({
  table,
  statusTabs = [],
  active = '',
  setActive = (tag) => {},
  tabClass = '',
  headerClass = '',
  filterType = '',
}) {
  const api = useApi();
  const { user } = useUser();
  const { entity } = useEntity();
  const { makeToast } = useToast();

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

  const handleExport = () => {
    exportOrders({
      api,
      userId: user?.id,
      entity,
    })
      .then((res) => {
        makeToast(res?.data?.message, 'success');
      })
      .catch((err) => {
        makeToast('An error occurred. Please try again or contact our support team.', 'error');
      });
  };

  return (
    <div className={classNames('border-b border-border-gray !z-50', headerClass)}>
      <ul className="flex flex-col-reverse flex-row justify-between items-end -mb-px text-sm text-center">
        {statusTabs.length > 0 && (
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
                      { 'border-b': tab !== statusTabs[statusTabs.length - 1] },
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
        )}
        {statusTabs.length > 0 && (
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
                      { 'gap-2': s.icon },
                    )}
                  >
                    {s.icon && <FontAwesomeIcon icon={s.icon} />}
                    <span className="capitalize">{s.name}</span>
                  </div>
                </li>
              );
            })}
          </div>
        )}
        {table.getRowModel().rows.length > 0 && (
          <div className="w-32 my-0">
            <PrimaryButton
              ariaLabel="export-order-history-button"
              buttonText="Export Orders"
              buttonColor="bg-primary-blue"
              hoverClass="hover:bg-primary-blue-hover"
              onClick={handleExport}
            />
          </div>
        )}
      </ul>
    </div>
  );
}
