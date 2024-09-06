import BorrowerDashboard from '@apps/borrower/components/home/BorrowerDashboard';
import PortalLayout from '@apps/borrower/components/PortalLayout';
import { DependenciesProvider } from '@contexts';
import useUser from '@hooks/useUser';

export default function BorrowerIndex() {
  const { user } = useUser();

  return (
    <PortalLayout>
      <DependenciesProvider
        user={user}
        fetchConfig={{
          stats: true,
          orders: true,
          default_terms: true,
          payment_methods: true,
        }}
      >
        <BorrowerDashboard />
      </DependenciesProvider>
    </PortalLayout>
  );
}
