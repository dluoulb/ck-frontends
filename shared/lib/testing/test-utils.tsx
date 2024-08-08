import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render as rtlRender } from '@testing-library/react';
import { useRouter } from 'next/router';
import { SuperTokensWrapper } from 'supertokens-auth-react';

import { ApiContext, QueryContext, UserContext } from '@contexts';
import api from '@lib/api';
import { renders } from './sharedTests';

const queryClient = new QueryClient();

const defaultUserContext = { user: null, setUser: jest.fn() };
const defaultQueryContext = { searchQuery: '', setSearchQuery: jest.fn() };

function customRender(
  ui,
  {
    userContext = defaultUserContext,
    queryContext = defaultQueryContext,
    routerQuery = {},
    ...renderOptions
  } = {}
) {
  (useRouter as jest.Mock).mockReturnValue({
    query: routerQuery,
  });

  // jest.mock('@lib/actions/entities');
  jest.mock('@hooks/useToast', () => ({
    default: () => ({ makeToast: jest.fn() }),
  }));

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <SuperTokensWrapper>
          <ApiContext.Provider value={api}>
            <UserContext.Provider value={userContext}>
              <QueryContext.Provider value={queryContext}>
                {children}
              </QueryContext.Provider>
            </UserContext.Provider>
          </ApiContext.Provider>
        </SuperTokensWrapper>
      </QueryClientProvider>
    );
  }

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
}

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { customRender, renders };
