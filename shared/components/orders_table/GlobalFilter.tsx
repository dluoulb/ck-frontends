import React from 'react';
import classNames from 'classnames';

export default function GlobalFilter({
  globalFilter,
  setGlobalFilter,
  defaultPlaceholder,
  containerClass = '',
  inputClass = '',
}) {
  return (
    <div className={containerClass}>
      <div className="input-group relative flex flex-wrap items-stretch w-full rounded">
        <input
          type="search"
          className={classNames(
            'form-control relative flex-auto min-w-0 block py-2 px-3 leading-tight font-normal bg-white bg-clip-padding border border-solid border-primary-gray-border rounded transition ease-in-out focus:outline-none',
            inputClass
          )}
          value={globalFilter || ''}
          onChange={(e) => setGlobalFilter(e.target.value)}
          placeholder={defaultPlaceholder}
          aria-label="Search"
          aria-describedby="search-input"
        />
      </div>
    </div>
  );
}
