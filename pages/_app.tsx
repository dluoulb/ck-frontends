import '../globals.css';

import { createContext, useEffect, useState } from 'react';
import { config } from '@fortawesome/fontawesome-svg-core';
import { ErrorBoundary, Provider } from '@rollbar/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import Head from 'next/head';
import { useRouter } from 'next/router';
import SuperTokens, { SuperTokensWrapper } from 'supertokens-auth-react';

import PortalLayout from '@apps/borrower/components/layout/PortalLayout';
import MainLayout from '@components/layout/MainLayout';
import SearchConfig from '@components/SearchConfig';
import { BorrowerContextProvider } from '@contexts/BorrowerContext';
import { EntityProvider } from '@contexts/EntityContext';
import { PromoContextProvider } from '@contexts/PromoContext';
import { QueryContext } from '@contexts/QueryContext';
import { UserProvider } from '@contexts/UserContext';
import api from '@lib/api';
import { SuperTokensConfig } from '@lib/constants/SuperTokensConfig';
import FullStory from '@lib/utils/fullstory';
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

  useEffect(() => {
    const fullstory = new FullStory();
    fullstory.init();
  }, []);

  return (
    <Provider config={rollbarConfig}>
      <Head>
        <meta name="apple-itunes-app" content="app-id=6503043940" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <SuperTokensWrapper>
          <ApiContext.Provider value={api}>
            <UserProvider>
              <QueryContext.Provider value={{ searchQuery, setSearchQuery }}>
                <EntityProvider>
                  <ErrorBoundary>
                    <PromoContextProvider>
                      <MainLayout>
                        <SearchConfig>
                          <PortalLayout>
                            {isBorrowerRoute ? (
                              <BorrowerContextProvider>
                                <Component {...pageProps} />
                              </BorrowerContextProvider>
                            ) : (
                              <Component {...pageProps} />
                            )}
                          </PortalLayout>
                        </SearchConfig>
                      </MainLayout>
                    </PromoContextProvider>
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
