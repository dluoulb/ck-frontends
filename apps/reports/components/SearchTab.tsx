import React from 'react';
import classNames from 'classnames';

const SearchTab = ({ content, setContent, type }) => {
  return (
    <div
      onClick={() => setContent(type)}
      className={classNames(
        'whitespace-nowrap border-b-2 border-gray-300 py-4 px-1 text-sm font-medium capitalize',
        content === type
          ? 'border-primary-blue text-primary-blue'
          : 'border-transparent text-tertiary-gray hover:border-primary-gray-border hover:text-secondary-gray',
      )}
    >
      {type === 'credit_key_applications' ? 'Applications' : type}
    </div>
  );
};

export default SearchTab;
