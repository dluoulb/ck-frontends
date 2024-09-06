import React, { createContext, useContext } from 'react';

import useBorrowerDependencies from '@apps/borrower/hooks/useBorrowerDependencies';

const DependenciesContext = createContext(null);

export const DependenciesProvider = ({
  children,
  user,
  fetchConfig,
}: {
  children: React.ReactNode;
  user: any;
  fetchConfig: {
    entity?: boolean;
    stats?: boolean;
    payment_methods?: boolean;
    default_terms?: boolean;
    orders?: boolean;
    company_users?: boolean;
  };
}) => {
  const { dependencies } = useBorrowerDependencies(user, fetchConfig);

  return (
    <DependenciesContext.Provider value={dependencies}>
      {children}
    </DependenciesContext.Provider>
  );
};

export const useBorrowerDeps = () => {
  const context = useContext(DependenciesContext);
  if (!context) {
    throw new Error(
      'useDependenciesContext must be used within an DependenciesProvider'
    );
  }
  return context;
};
