import '@fortawesome/fontawesome-svg-core/styles.css';

import type { ReactElement, ReactNode } from 'react';
import { createContext, useState } from 'react';
import { config } from '@fortawesome/fontawesome-svg-core';
import { ErrorBoundary, Provider } from '@rollbar/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import SuperTokens, { SuperTokensWrapper } from 'supertokens-auth-react';

import '../global.css';

import MainLayout from '@components/layout/MainLayout';
import SearchConfig from '@components/SearchConfig';
import { QueryContext } from '@contexts/QueryContext';
import { UserContext } from '@contexts/UserContext';
import api from '@lib/api';
import { SuperTokensConfig } from '@lib/constants/SuperTokensConfig';
import { rollbarConfig } from '@lib/utils/rollbar';

config.autoAddCss = false;

const queryClient = new QueryClient();
export const ApiContext = createContext(api);

if (typeof window !== 'undefined') {
  SuperTokens.init(SuperTokensConfig);
}

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function App({ Component, pageProps }: AppPropsWithLayout) {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <Provider config={rollbarConfig}>
      <QueryClientProvider client={queryClient}>
        <SuperTokensWrapper>
          <ApiContext.Provider value={api}>
            <UserContext.Provider value={{ user, setUser }}>
              <QueryContext.Provider value={{ searchQuery, setSearchQuery }}>
                <ErrorBoundary>
                  <MainLayout>
                    <SearchConfig>
                      {getLayout(<Component {...pageProps} />)}
                    </SearchConfig>
                  </MainLayout>
                </ErrorBoundary>
              </QueryContext.Provider>
            </UserContext.Provider>
          </ApiContext.Provider>
        </SuperTokensWrapper>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </Provider>
  );
}
export default App;
