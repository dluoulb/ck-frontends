import React, { useEffect, Fragment } from 'react';
import { faAngleDown, faAngleUp } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import Pagination from './Pagination';

export default function BaseTable({
  tableInstance,
  expandedRow = null,
  noDataFoundWarning = '',
  onClickHandler = null,
  rowClass = '',
  headerClass = '',
  tableClass = '',
  addRows = 0,
  fillTable = false,
  totalRows = null,
}) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageCount,
    gotoPage,
    rows,
    prepareRow,
    visibleColumns,
    state: { pageIndex, pageSize },
  } = tableInstance;

  let additionalRows = [];
  const rowList = page ? page : rows;
  const usePagination = page ? true : false;

  for (let i = 0; i <= addRows; i++) {
    additionalRows.push(
      <tr key={i}>
        <td
          colSpan={visibleColumns.length}
          className={classNames('px-4 pt-3 pb-1', rowClass)}
        />
      </tr>
    );
  }

  const fillTableRows = () => {
    let additionalRows = [];
    if (rowList.length < pageSize) {
      for (let i = 0; i < pageSize - rowList.length; i++) {
        additionalRows.push(
          <tr key={i} className="h-1/5">
            <td
              colSpan={visibleColumns.length}
              className={classNames('px-4 pt-3 pb-1', rowClass)}
            />
          </tr>
        );
      }
    }
    return additionalRows;
  };

  window.addEventListener('resize', () => {
    tableInstance.columns.forEach((column) => {
      if (window.innerWidth <= column.hideColumn && column.isVisible) {
        column.toggleHidden(true);
      }
      if (window.innerWidth >= column.hideColumn && !column.isVisible) {
        column.toggleHidden(false);
      }
    });
  });

  useEffect(() => {
    tableInstance.columns.forEach((column) => {
      if (window.innerWidth <= column.hideColumn && column.isVisible) {
        column.toggleHidden(true);
      }
      if (window.innerWidth >= column.hideColumn && !column.isVisible) {
        column.toggleHidden(false);
      }
    });
  },[])

  useEffect(() => {
    tableInstance.columns.forEach((column) => {
      if (window.innerWidth <= column.hideColumn && column.isVisible) {
        column.toggleHidden(true);
      }
      if (window.innerWidth >= column.hideColumn && !column.isVisible) {
        column.toggleHidden(false);
      }
    });
  },[window.innerWidth])

  return (
    <>
      <table {...getTableProps()} className={`min-w-full ${tableClass}`}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              className="border-b sticky top-0"
            >
              {headerGroup.headers.map((column) => (
                <th
                  scope="col"
                  className={classNames(
                    'py-4 text-left text-sm text-primary bg-secondary-blue',
                    column.isSorted ? 'px-4 sm:px-8' : 'px-6 sm:px-8',
                    headerClass
                  )}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render('Header')}
                  <span>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <FontAwesomeIcon
                          icon={faAngleDown}
                          className="text-primary ml-1"
                        />
                      ) : (
                        <FontAwesomeIcon
                          icon={faAngleUp}
                          className="text-primary ml-1"
                        />
                      )
                    ) : (
                      ' '
                    )}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody
          {...getTableBodyProps()}
          className="text-sm mid:text-base -mx-2 overflow-auto text-primary"
        >
          {rows.length > 0 ? (
            rowList.map((row, i) => {
              prepareRow(row);
              const expandedRowProps = expandedRow
                ? row.getRowProps(row.getToggleRowExpandedProps())
                : {};

              return (
                <Fragment key={i}>
                  <tr
                    {...expandedRowProps}
                    onClick={() =>
                      onClickHandler ? onClickHandler(row.original) : {}
                    }
                    style={
                      row.isExpanded
                        ? { background: '#59738E', color: 'white' }
                        : null
                    }
                    className={classNames(
                      'py-4 border-b last:border-b-0',
                      onClickHandler
                        ? 'cursor-pointer hover:bg-primary-blue hover:bg-secondary-blue'
                        : ''
                    )}
                  >
                    {row.cells.map((cell) => {
                      return (
                        <td
                          {...cell.getCellProps({
                            className: classNames(
                              'py-4 whitespace-nowrap',
                              rowClass,
                              cell.column.className,
                              cell.column.isSorted
                                ? 'px-5 sm:px-8'
                                : 'px-6 sm:px-8'
                            ),
                          })}
                        >
                          {cell.render('Cell')}
                        </td>
                      );
                    })}
                  </tr>
                  {fillTable && fillTableRows()}
                  {row.isExpanded && (
                    <tr className="bg-secondary-blue">
                      <td colSpan={visibleColumns.length}>{expandedRow}</td>
                    </tr>
                  )}
                </Fragment>
              );
            })
          ) : (
            <>
              <tr>
                <td colSpan={visibleColumns.length} className="p-2 lg:p-4">
                  {noDataFoundWarning}
                </td>
              </tr>
              {addRows ? additionalRows : null}
            </>
          )}
        </tbody>
      </table>
      {usePagination && (
        <Pagination
          page={page}
          rows={rows}
          pageCount={pageCount}
          previousPage={previousPage}
          canPreviousPage={canPreviousPage}
          nextPage={nextPage}
          canNextPage={canNextPage}
          pageIndex={pageIndex}
          gotoPage={gotoPage}
          pageSize={pageSize}
          totalRows={totalRows}
        />
      )}
    </>
  );
}
