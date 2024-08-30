import React, { createContext, useContext } from 'react';

import useBorrowerDependencies from '@apps/borrower/hooks/useBorrowerDependencies';

const EntitiesContext = createContext(null);

export const EntitiesProvider = ({ children, user }) => {
  const { userProps } = useBorrowerDependencies(user);

  return (
    <EntitiesContext.Provider value={userProps}>
      {children}
    </EntitiesContext.Provider>
  );
};

export const useBorrowerDeps = () => {
  const context = useContext(EntitiesContext);
  if (!context) {
    throw new Error(
      'useBorrowerDepsContext must be used within an EntitiesProvider'
    );
  }
  return context;
};
