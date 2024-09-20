import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render as rtlRender } from '@testing-library/react';
import { ApiContext } from 'pages/_app';
import { SuperTokensWrapper } from 'supertokens-auth-react';

import BorrowerPageWrapper from '@apps/borrower/components/layout/BorrowerPageWrapper';
import { QueryContext } from '@contexts/QueryContext';
import { UserProvider } from '@contexts/UserContext';
import api from '@lib/api';
import { renders } from './sharedTests';

const defaultQueryContext = { searchQuery: '', setSearchQuery: jest.fn() };

function customRender(
  ui,
  {
    user = null,
    isImpersonating = false,
    parentID = '',
    routerQuery = {},
    withBorrowerProviders = false,
    ...renderOptions
  } = {}
) {
  const queryClient = new QueryClient();

  jest.mock('@hooks/useToast', () => ({
    default: () => ({ makeToast: jest.fn() }),
  }));

  function Wrapper({ children }: { children: React.ReactNode }) {
    const initialUserState = { user, isImpersonating, parentID };
    
    return (
      <QueryClientProvider client={queryClient}>
        <SuperTokensWrapper>
          <ApiContext.Provider value={api}>
            <UserProvider initialUserState={initialUserState}>
              <QueryContext.Provider value={defaultQueryContext}>
                {withBorrowerProviders ? (
                  <BorrowerPageWrapper>{children}</BorrowerPageWrapper>
                ) : (
                  children
                )}
              </QueryContext.Provider>
            </UserProvider>
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
