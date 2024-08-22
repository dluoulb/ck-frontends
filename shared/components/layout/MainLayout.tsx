import { useContext, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { Toaster } from 'react-hot-toast';
import Session from 'supertokens-auth-react/recipe/session';

import Title from '@components/Title';
import { UserContext } from '@contexts';
import useApi from '@hooks/useApi';
import { getUser } from '@lib/actions/users';
import { parseUserJwt } from '@lib/utils/authorization';
import StaticFooter from './StaticFooter';
import StaticHeader from './StaticHeader';

export default function MainLayout({ children }) {
  const router = useRouter();
  const api = useApi();
  const { setUser } = useContext(UserContext);

  const getCurrentUser = useMutation({
    mutationFn: (id: string) => getUser(api, id),
    onSuccess: (data) => setUser(data.attributes),
    onError: (error) =>
      console.log('Error occurred fetching current user', { error }),
    retry: 1,
  });

  useEffect(() => {
    if (Session.doesSessionExist) {
      Session.getAccessToken().then((token) => {
        getCurrentUser.mutate(parseUserJwt(token));
      });
    }
  }, [Session]);

  return (
    <div>
      <Title pathname={router.pathname} />

      <div className="flex flex-col min-h-screen font-manrope relative">
        <StaticHeader />
        <div className="flex-grow w-full">
          <div className="w-[90%] sm:container md:max-w-[900px] lg:max-w-[1200px] xl:!container mx-auto md:px-4 xl:px-8 pt-16">
            {children}
          </div>
        </div>
        <StaticFooter />
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
      </div>
    </div>
  );
}
