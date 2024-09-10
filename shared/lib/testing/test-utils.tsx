import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render as rtlRender } from '@testing-library/react';
import { ApiContext } from 'pages/_app';
import { SuperTokensWrapper } from 'supertokens-auth-react';

import { DependenciesProvider } from '@contexts/DependenciesContext';
import { EntityProvider } from '@contexts/EntityContext';
import { PossessedUserProvider } from '@contexts/PossessedUserContext';
import { QueryContext } from '@contexts/QueryContext';
import { UserContext } from '@contexts/UserContext';
import api from '@lib/api';
import { renders } from './sharedTests';

const defaultUserContext = { user: null, setUser: jest.fn() };
const defaultQueryContext = { searchQuery: '', setSearchQuery: jest.fn() };

function customRender(
  ui,
  {
    routerQuery = {},
    withBorrowerProviders = false,
    fetchConfig = {},
    user = null,
    ...renderOptions
  } = {}
) {
  const queryClient = new QueryClient();

  jest.mock('@hooks/useToast', () => ({
    default: () => ({ makeToast: jest.fn() }),
  }));

  function Wrapper({ children }: { children: React.ReactNode }) {
    const userContextValue = {
      ...defaultUserContext,
      user: user || defaultUserContext.user,
    };
    return (
      <QueryClientProvider client={queryClient}>
        <SuperTokensWrapper>
          <ApiContext.Provider value={api}>
            <UserContext.Provider value={userContextValue}>
              <QueryContext.Provider value={defaultQueryContext}>
                {withBorrowerProviders ? (
                  <EntityProvider>
                    <PossessedUserProvider>
                      <DependenciesProvider
                        user={user}
                        fetchConfig={fetchConfig}
                      >
                        {children}
                      </DependenciesProvider>
                    </PossessedUserProvider>
                  </EntityProvider>
                ) : (
                  children
                )}
              </QueryContext.Provider>
            </UserContext.Provider>
          </ApiContext.Provider>
        </SuperTokensWrapper>
      </QueryClientProvider>
    );
  }

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

afterEach(() => {
  jest.clearAllMocks();
});

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { customRender, renders };
