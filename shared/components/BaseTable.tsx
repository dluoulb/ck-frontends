import React from 'react';
import { faAngleDown, faAngleUp } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { flexRender } from '@tanstack/react-table';
import classNames from 'classnames';

import Loading from './Loading';
import Pagination from './Pagination';

export default function BaseTable({
  table,
  rowClass = '',
  tableClass = '',
  headerClass = '',
  onClickHandler = null,
  noDataFoundWarning = '',
  isFetching = false,
  isPageCached = false,
  usePagination = true,
  hideHeader = false,
}) {
  const emptyRows = 0;

  return (
    <div>
      <div className="overflow-x-auto">
        <table className={`min-w-full text-primary ${tableClass}`}>
          {!hideHeader && (
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="h-full">
                  {headerGroup.headers.map(
                    (header) =>
                      header.column.getIsVisible() && (
                        <th
                          key={header.id}
                          onClick={header.column.getToggleSortingHandler()}
                          className={classNames(
                            'px-6 py-4 text-left text-sm bg-[#F4F8FF] sticky top-0 z-10 h-full border-b border-border-gray',
                            { 'cursor-pointer': header.column.getCanSort() },
                            headerClass,
                          )}
                        >
                          <div className="flex items-center gap-1">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            <span
                              className={classNames('inline-block w-4', {
                                invisible: !header.column.getIsSorted(),
                              })}
                            >
                              {{
                                asc: <FontAwesomeIcon icon={faAngleUp} />,
                                desc: <FontAwesomeIcon icon={faAngleDown} />,
                              }[header.column.getIsSorted()] ?? null}
                            </span>
                          </div>
                        </th>
                      ),
                  )}
                </tr>
              ))}
            </thead>
          )}
          <tbody className="text-sm mid:text-base">
            {isFetching && !isPageCached ? (
              <tr>
                <td
                  className="py-3 whitespace-nowrap px-4 text-sm normal-case"
                  colSpan={table.getHeaderGroups()[0].headers.length}
                >
                  <Loading containerClass="min-h-96" className="my-36 w-14 h-14" />
                </td>
              </tr>
            ) : !table.getRowModel().rows.length ? (
              <>
                <tr>
                  <td
                    className="py-3 whitespace-nowrap px-4 text-sm normal-case"
                    colSpan={table.getHeaderGroups()[0].headers.length}
                  >
                    {noDataFoundWarning}
                  </td>
                </tr>
              </>
            ) : (
              <>
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className={classNames(
                      'border-b border-gray-200 last:border-b-0',
                      onClickHandler
                        ? 'cursor-pointer hover:bg-primary-blue hover:bg-secondary-blue'
                        : '',
                    )}
                  >
                    {row.getVisibleCells().map((cell, cellIndex) => {
                      const className = classNames(
                        'py-3 whitespace-nowrap w-max',
                        rowClass,
                        cell.column.columnDef.className,
                        cell.column.getIsSorted() ? 'px-5 sm:px-6' : 'px-6',
                        cellIndex === 0 && hideHeader && 'pl-0',
                        cellIndex === row.getVisibleCells().length - 1 && hideHeader && 'pr-0',
                      );

                      return (
                        <td key={cell.id} className={className}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {Array.from({ length: emptyRows }).map((_, index) => (
                  <tr key={`empty-${index}`} className="py-4 border-b border-gray-200">
                    <td
                      className="py-6 whitespace-nowrap"
                      colSpan={table.getHeaderGroups()[0].headers.length}
                    />
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
      {usePagination && table.getRowCount() > 0 && (
        <Pagination table={table} totalCount={table.getRowCount()} />
      )}
    </div>
  );
}
