import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render as rtlRender } from '@testing-library/react';
import { ApiContext } from 'pages/_app';
import { SuperTokensWrapper } from 'supertokens-auth-react';

import { BorrowerContextProvider } from '@contexts/BorrowerContext';
import { QueryContext } from '@contexts/QueryContext';
import { UserProvider } from '@contexts/UserContext';
import api from '@lib/api';
import { companyApproved } from './records';
import { renders } from './sharedTests';

const defaultQueryContext = { searchQuery: '', setSearchQuery: jest.fn() };

function customRender(
  ui,
  {
    user = companyApproved.borrower,
    isImpersonating = false,
    isAdminUser = false,
    parentID = '',
    routerQuery = {},
    withBorrowerProviders = false,
    ...renderOptions
  } = {}
) {
  const queryClient = new QueryClient();

  const { useRouter } = jest.requireMock('next/router');
  useRouter.mockReturnValue({
    query: routerQuery,
    push: jest.fn(),
    pathname: '',
  });

  jest.mock('@hooks/useToast', () => ({
    default: () => ({ makeToast: jest.fn() }),
  }));

  function Wrapper({ children }: { children: React.ReactNode }) {
    const initialUserState = { user, isAdminUser, isImpersonating, parentID };

    return (
      <QueryClientProvider client={queryClient}>
        <SuperTokensWrapper>
          <ApiContext.Provider value={api}>
            <UserProvider initialUserState={initialUserState}>
              <QueryContext.Provider value={defaultQueryContext}>
                {withBorrowerProviders ? (
                  <BorrowerContextProvider>{children}</BorrowerContextProvider>
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
