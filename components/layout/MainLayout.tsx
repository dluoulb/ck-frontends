import { useContext, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import Session from 'supertokens-auth-react/recipe/session';

import StaticFooter from './StaticFooter';
import StaticHeader from './StaticHeader';
import Title from '@components/Title';
import useApi from 'hooks/useApi';
import { getUser } from 'lib/actions/users';
import { parseUserJwt } from 'lib/utils/authorization';
import { UserContext } from 'contexts';

export default function MainLayout({ children }) {
  const router = useRouter();
  const api = useApi();
  const { setUser } = useContext(UserContext);

  const getCurrentUser = useMutation({
    mutationFn: (id: string) => {
      return getUser(api, id);
    },
    onSuccess: (data, variables) => {
      setUser(data.attributes);
    },
    onError: (error) => {
      console.log('Error occured fetching current user', { error });
    },
    retry: 1,
  });

  useEffect(() => {
    if (Session.doesSessionExist()) {
      Session.getAccessToken().then((token) => {
        getCurrentUser.mutate(parseUserJwt(token));
      });
    }
  }, [Session]);

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