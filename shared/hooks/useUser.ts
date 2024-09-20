import { useContext, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';

import { UserContext } from '@contexts/UserContext';
import { routes } from '@lib/constants/SiteVariables';

export default function useUser() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser, isImpersonating, parentID } = useContext(UserContext);

  useEffect(() => {
    if (
      user &&
      !isImpersonating &&
      !['/', '/unauthorized'].includes(pathname)
    ) {

      //TODO: CHANGE! if admin is impersonating, delete the impersonation before going to new UI
      const route = routes.find(
        (r) => r.href.slice(1) === pathname?.split('/')[1]
      );
      if (!route?.approvedRoles?.includes(user?.role))
        router.push('/unauthorized');
    }
  }, [user, router]);

  return { user, setUser, isImpersonating, parentID };
}
