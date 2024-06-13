import { createContext, Dispatch, SetStateAction } from 'react';

interface QueryState {
  searchQuery: any;
  setSearchQuery: Dispatch<SetStateAction<any>>;
}

const defaultState: QueryState = {
  searchQuery: null,
  setSearchQuery: () => {},
};

export const QueryContext = createContext<QueryState>(defaultState);