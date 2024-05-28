import axios from "axios";
import { useState, createContext } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { AuthContext, UserContext } from "contexts";

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
  const [auth, setAuth] = useState(null);
  const [user, setUser] = useState(null);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ auth, setAuth }}>
        <ApiContext.Provider value={api}>
          <UserContext.Provider value={{ user, setUser }}>
            <Component {...pageProps} />
          </UserContext.Provider>
        </ApiContext.Provider>
      </AuthContext.Provider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
