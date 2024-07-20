import React from 'react';
import { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/router';

import Title from '@components/Title';
import StaticFooter from './StaticFooter';
import StaticHeader from './StaticHeader';
import useSessionExpiration from 'hooks/useSessionExpiration';

export default function MainLayout({ children }) {
  useSessionExpiration();
  const router = useRouter();

  return (
    <div>
      <Title pathname={router.pathname} />

      <div className="flex flex-col min-h-screen font-manrope">
        <StaticHeader />
        <div className="flex-grow container md:max-w-[900px] lg:max-w-[1200px] xl:!container mx-auto px-4 xl:px-8">
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
            },
          }}
        />
        <StaticFooter />
      </div>
    </div>
  );
}
