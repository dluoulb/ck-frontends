import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { DateTime } from "luxon";

import useToast from "./useToast";

const useSessionExpiration = () => {
  const pathname = usePathname();
  const { makeToast } = useToast();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session) {
      const expirationTime =
        DateTime.fromISO(session.expires).toMillis() -
        DateTime.now().toMillis();

      const handleExpiration = () => {
        makeToast(
          "Your session has expired. You are being redirected to log in again.",
          "error"
        );

        setTimeout(() => {
          // TODO: NEED TO DETERMINE BEST WAY TO ROUTE TO SAME HOSTNAME
          signOut({
            callbackUrl: `/login?from=${pathname?.replace("/", "")}`,
          });
        }, 5000);
      };

      if (expirationTime <= 0) {
        handleExpiration();
      } else {
        const timeout = setTimeout(handleExpiration, expirationTime);

        return () => clearTimeout(timeout);
      }
    }
  }, [session, status, pathname]);
};

export default useSessionExpiration;
