import BorrowerDashboard from '@apps/borrower/components/home/BorrowerDashboard';
import PortalLayout from '@apps/borrower/components/PortalLayout';
import { EntitiesProvider } from '@contexts';
import useUser from '@hooks/useUser';

export default function BorrowerIndex() {
  const { user } = useUser();

  return (
    <PortalLayout>
      <EntitiesProvider
        user={user}
        fetchConfig={{
          entity: true,
          stats: true,
          orders: true,
          default_terms: true,
          payment_methods: true,
        }}
      >
        <BorrowerDashboard />
      </EntitiesProvider>
    </PortalLayout>
  );
}
