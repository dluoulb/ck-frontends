import React, { useContext, useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { SearchBox, useSearchBox } from 'react-instantsearch';

import HitTab from '@apps/reports/components/search_results/HitTab';
import SearchResults from '@apps/reports/components/search_results/SearchResults';
import SearchTab from '@apps/reports/components/SearchTab';
import { QueryContext } from '@contexts/QueryContext';

function Reports() {
  const queryClient = useQueryClient();
  const { query, refine } = useSearchBox();
  const { searchQuery, setSearchQuery } = useContext(QueryContext);
  const [content, setContent] = useState('all');

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ['orders', 'company', 'applications', 'documents'],
    });
  }, [queryClient]);

  useEffect(() => {
    if (searchQuery) refine(searchQuery);
  }, [refine, searchQuery]);

  useEffect(() => {
    if (query) setSearchQuery(query);
  }, [query, setSearchQuery]);

  const types = ['all', 'companies', 'orders', 'credit_key_applications', 'users'];

  const getContent = () => {
    switch (content) {
      case 'all':
        return <SearchResults query={searchQuery} />;
      case 'companies':
      case 'orders':
      case 'credit_key_applications':
      case 'users':
        return <HitTab type={content} query={searchQuery} />;
      default:
        return <SearchResults query={searchQuery} />;
    }
  };

  return (
    <main>
      <div className="xl:max-w-[90%] mx-auto">
        <h1 className="text-3xl font-bold text-primary my-6">Credit Key Reporting UI</h1>
        <div className="mt-4 mb-2">
          <SearchBox
            classNames={{
              root: 'relative mb-1.5',
              input:
                'block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500',
              submit: 'absolute inset-y-0 left-1.5 top-5 flex pl-3 pointer-events-none',
              submitIcon: 'w-3.5 h-3.5 text-dark-gray',
              reset: 'hidden',
            }}
            placeholder="Begin typing to search for companies ..."
          />
          <p className="text-sm text-light-gray pl-1">
            Search by company name, phone, or order key
          </p>
        </div>
        {searchQuery && (
          <>
            <div className="hidden sm:block">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8 cursor-pointer" aria-label="Tabs">
                  {types.map((t, idx) => {
                    return (
                      <SearchTab key={idx} content={content} setContent={setContent} type={t} />
                    );
                  })}
                </nav>
              </div>
            </div>
            {getContent()}
          </>
        )}
      </div>
    </main>
  );
}

export default Reports;
