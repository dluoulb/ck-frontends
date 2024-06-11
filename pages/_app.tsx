import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

import axios from "axios";
import { useState, createContext } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import "../global.css";
import { ProvideAuth } from "../hooks/useAuth";
import { SessionProvider } from "next-auth/react";
import { UserContext } from "../contexts";
import MainLayout from "@components/layout/MainLayout";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: headers,
});

const queryClient = new QueryClient();
export const ApiContext = createContext(api);

function App({ Component, pageProps }) {
  const [user, setUser] = useState(null);

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={pageProps.session}>
        <ProvideAuth>
          <ApiContext.Provider value={api}>
            <UserContext.Provider value={{ user, setUser }}>
              <MainLayout>
                <Component {...pageProps} />
              </MainLayout>
            </UserContext.Provider>
          </ApiContext.Provider>
        </ProvideAuth>
      </SessionProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
export default App;
