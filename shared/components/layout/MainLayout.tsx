import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Toaster } from 'react-hot-toast';
import Session from 'supertokens-auth-react/recipe/session';

import Loading from '@components/Loading';
import Title from '@components/Title';
import { useUser } from '@contexts/UserContext';
import { parseUserJwt } from '@lib/utils/authorization';
import StaticFooter from './StaticFooter';
import StaticHeader from './StaticHeader';

type TokenData = {
  userID: string;
  isImpersonating: boolean;
  parentID: string;
};

export default function MainLayout({ children }) {
  const router = useRouter();
  const { user, getCurrentUser } = useUser();

  useEffect(() => {
    if (Session.doesSessionExist) {
      Session.getAccessToken().then((token) => {
        const parsedToken: TokenData = parseUserJwt(token);
        const { userID, isImpersonating, parentID } = parsedToken;

        getCurrentUser({
          userID,
          isImpersonating,
          parentID,
        } as TokenData);
      });
    }
  }, [Session]);

  if (!user || !Session.doesSessionExist)
    return <Loading className="w-14 h-14 my-36" />;

  return (
    <div className="flex flex-col min-h-screen font-manrope relative">
      <Title pathname={router.pathname} />
      <StaticHeader />
      <div className="flex-grow flex flex-col min-h-screen sm:min-h-auto w-full mb-48 lg:mb-0 pb-48">
        <div className="w-[90%] xl:container 2xl:max-w-full mx-auto 2xl:px-8 pt-16 flex-grow">
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
