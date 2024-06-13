import React from "react";
import { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";

import StaticFooter from "./StaticFooter";
import StaticHeader from "./StaticHeader";
import Title from "@components/Title";
import useSessionExpiration from "hooks/useSessionExpiration";

export default function MainLayout({ children }) {
  useSessionExpiration();
  const router = useRouter();

  return (
    <div>
      <Title pathname={router.pathname} />

      <div className="flex flex-col min-h-screen font-manrope">
        <StaticHeader />
        <div className="flex-grow container mx-auto px-4 lg:px-6 xl:px-8 mb-10">
          {children}
        </div>
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          toastOptions={{
            duration: 5000,
            style: {
              boxShadow: "none",
              minWidth: "30%",
              background: "none",
            },
          }}
        />
        <StaticFooter />
      </div>
    </div>
  );
}
