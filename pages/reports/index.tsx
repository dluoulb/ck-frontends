import React, { useContext, useEffect, useState } from "react";
import { SearchBox, useSearchBox } from "react-instantsearch";
import { useQueryClient } from "@tanstack/react-query";

import { QueryContext } from "contexts";
import HitTab from "@reports/search_results/HitTab";
import SearchResults from "@reports/search_results/SearchResults";
import SearchTab from "@reports/SearchTab";

function Reports() {
  const queryClient = useQueryClient();
  const { query, refine } = useSearchBox();
  const { searchQuery, setSearchQuery } = useContext(QueryContext);
  const [content, setContent] = useState("all");

  queryClient.invalidateQueries({
    queryKey: ["orders", "company", "applications", "documents"],
  });

  useEffect(() => {
    if (searchQuery) refine(searchQuery);
  }, []);

  useEffect(() => {
    if (query) setSearchQuery(query);
  }, [query]);

  const types = [
    "all",
    "companies",
    "orders",
    "credit_key_applications",
    "users",
  ];

  const getContent = () => {
    switch (content) {
      case "all":
        return <SearchResults query={searchQuery} />;
      case "companies":
      case "orders":
      case "credit_key_applications":
      case "users":
        return <HitTab type={content} query={searchQuery} />;
      default:
        return <SearchResults query={searchQuery} />;
    }
  };

  return (
    <main>
      <div className="xl:max-w-[90%] mx-auto">
        <div className="mt-4 mb-2">
          <SearchBox
            classNames={{
              root: "relative mb-2",
              input:
                "block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500",
              submit:
                "absolute inset-y-0 left-1.5 top-5 flex pl-3 pointer-events-none",
              submitIcon: "w-3.5 h-3.5 text-dark-gray",
              reset: "hidden",
            }}
            placeholder="Begin typing to search for companies ..."
          />
          <p className="text-sm text-light-gray pl-2">
            Search by company name, phone, or order key
          </p>
        </div>
        {searchQuery && (
          <>
            <div className="hidden sm:block">
              <div className="border-b border-gray-200">
                <nav
                  className="-mb-px flex space-x-8 cursor-pointer"
                  aria-label="Tabs"
                >
                  {types.map((t, idx) => {
                    return (
                      <SearchTab
                        key={idx}
                        content={content}
                        setContent={setContent}
                        type={t}
                      />
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
