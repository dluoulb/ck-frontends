import { useContext, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';

import { useEntity } from '@contexts/EntityContext';
import { UserContext } from '@contexts/UserContext';
import { routes } from '@lib/constants/SiteVariables';

export default function usePossessedUser() {
  const { entity, setEntity, fetchEntity } = useEntity();
  const pathname = usePathname();
  const { user, setUser, isImpersonating, parentID } = useContext(UserContext);

  useEffect(() => {
  }, []);

  return { user, setUser, isImpersonating, parentID };
}
