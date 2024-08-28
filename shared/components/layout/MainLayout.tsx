import { useContext, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import { Toaster } from 'react-hot-toast';
import { routes } from 'shared/routes';
import Session from 'supertokens-auth-react/recipe/session';

import Title from '@components/Title';
import { UserContext } from '@contexts';
import useApi from '@hooks/useApi';
import { getUser } from '@lib/actions/users';
import { parseUserJwt } from '@lib/utils/authorization';
import StaticFooter from './StaticFooter';
import StaticHeader from './StaticHeader';
import { usePathname } from 'next/navigation';

export default function MainLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const api = useApi();
  const { user, setUser } = useContext(UserContext);

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

  useEffect(() => {
    if (user && !['/', '/unauthorized'].includes(pathname)) {
      const route = routes.find((r) => (r.href === pathname));
      if (!route?.approvedRoles?.includes(user?.role))
        router.push('/unauthorized');
    }
  }, [user, router]);

  return (
    <div className="flex flex-col min-h-screen font-manrope relative">
      <Title pathname={router.pathname} />
      <StaticHeader />
      <div className="flex-grow">
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
          duration: 50000,
          style: {
            boxShadow: 'none',
            maxWidth: '350px',
            background: 'none',
            display: 'auto',
          },
        }}
      />
    </div>
  );
}
