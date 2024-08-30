import BorrowerDashboard from '@apps/borrower/components/home/BorrowerDashboard';
import PortalLayout from '@apps/borrower/components/PortalLayout';
import Scripts from '@components/Scripts';
import { EntitiesProvider } from '@contexts';
import useUser from '@hooks/useUser';

export default function BorrowerIndex() {
  const { user } = useUser();
  return (
    <>
      <Scripts />
      <PortalLayout>
        <EntitiesProvider user={user}>
          <BorrowerDashboard />
        </EntitiesProvider>
      </PortalLayout>
    </>
  );
}
