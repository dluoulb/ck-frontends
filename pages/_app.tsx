import '../globals.scss';

import { createContext, useState } from 'react';
import { config } from '@fortawesome/fontawesome-svg-core';
import { ErrorBoundary, Provider } from '@rollbar/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useRouter } from 'next/router';
import SuperTokens, { SuperTokensWrapper } from 'supertokens-auth-react';
import MainLayout from '@components/layout/MainLayout';
import SearchConfig from '@components/SearchConfig';
import { BorrowerContextProvider } from '@contexts/BorrowerContext';
import { EntityProvider } from '@contexts/EntityContext';
import { QueryContext } from '@contexts/QueryContext';
import { UserProvider } from '@contexts/UserContext';
import api from '@lib/api';
import { SuperTokensConfig } from '@lib/constants/SuperTokensConfig';
import { rollbarConfig } from '@lib/utils/rollbar';

config.autoAddCss = false;

const queryClient = new QueryClient();
export const ApiContext = createContext(api);

if (typeof window !== 'undefined') {
  SuperTokens.init(SuperTokensConfig);
}

function App({ Component, pageProps }) {
  const { pathname } = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const isBorrowerRoute = pathname?.startsWith('/borrower');

  return (
    <Provider config={rollbarConfig}>
      <QueryClientProvider client={queryClient}>
        <SuperTokensWrapper>
          <ApiContext.Provider value={api}>
            <UserProvider>
              <QueryContext.Provider value={{ searchQuery, setSearchQuery }}>
                <EntityProvider>
                  <ErrorBoundary>
                    <MainLayout>
                      <SearchConfig>
                        {isBorrowerRoute ? (
                          <BorrowerContextProvider>
                            <Component {...pageProps} />
                          </BorrowerContextProvider>
                        ) : (
                          <Component {...pageProps} />
                        )}
                      </SearchConfig>
                    </MainLayout>
                  </ErrorBoundary>
                </EntityProvider>
              </QueryContext.Provider>
            </UserProvider>
          </ApiContext.Provider>
        </SuperTokensWrapper>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  );
}
export default App;
