import React from "react";

import StaticFooter from "./StaticFooter";
import StaticHeader from "./StaticHeader";
import useSessionExpiration from "hooks/useSessionExpiration";
import { Toaster } from "react-hot-toast";

export default function MainLayout({ children }) {
  useSessionExpiration();

  return (
    <div className="flex flex-col min-h-screen">
      <StaticHeader />
      <div className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </div>
      <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 5000,
            style: {
              boxShadow: 'none',
              minWidth: '30%',
              background: 'none',
            },
          }}
        />
      <StaticFooter />
    </div>
  );
}
