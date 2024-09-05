import { useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { Toaster } from 'react-hot-toast';
import Session from 'supertokens-auth-react/recipe/session';

import Loading from '@components/Loading';
import Title from '@components/Title';
import useApi from '@hooks/useApi';
import useUser from '@hooks/useUser';
import { getUser } from '@lib/actions/users';
import { parseUserJwt } from '@lib/utils/authorization';
import StaticFooter from './StaticFooter';
import StaticHeader from './StaticHeader';

export default function MainLayout({ children }) {
  const router = useRouter();
  const api = useApi();
  const { user, setUser } = useUser();

  const getCurrentUser = useMutation({
    mutationFn: (id: string) => getUser(api, id),
    onSuccess: (data) => setUser(data),
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

  if (!user || !Session.doesSessionExist) return <Loading className="w-14 h-14 my-36" />;

  return (
    <div className="flex flex-col min-h-screen font-manrope relative">
      <Title pathname={router.pathname} />
      <StaticHeader />
      <div className="flex-grow flex flex-col w-full pb-48">
        <div className="w-[90%] sm:container md:max-w-[900px] lg:max-w-[1200px] xl:!container mx-auto md:px-4 xl:px-8 pt-16 flex-grow">
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
            maxWidth: '375px',
            background: 'none',
            display: 'auto',
          },
        }}
      />
    </div>
  );
}
