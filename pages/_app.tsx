import '@fortawesome/fontawesome-svg-core/styles.css';

import { createContext, useState } from 'react';
import { config } from '@fortawesome/fontawesome-svg-core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import '../global.css';

import MainLayout from '@components/layout/MainLayout';
import SearchConfig from '@components/SearchConfig';
import api from 'lib/api';
import { SessionProvider } from 'next-auth/react';

import { QueryContext, UserContext } from '../contexts';
import { ProvideAuth } from '../hooks/useAuth';

config.autoAddCss = false;

const queryClient = new QueryClient();
export const ApiContext = createContext(api);

function App({ Component, pageProps: { session, ...pageProps } }) {
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <ProvideAuth>
          <ApiContext.Provider value={api}>
            <UserContext.Provider value={{ user, setUser }}>
              <QueryContext.Provider value={{ searchQuery, setSearchQuery }}>
                <MainLayout>
                  <SearchConfig>
                    <Component {...pageProps} />
                  </SearchConfig>
                </MainLayout>
              </QueryContext.Provider>
            </UserContext.Provider>
          </ApiContext.Provider>
        </ProvideAuth>
      </SessionProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
export default App;
