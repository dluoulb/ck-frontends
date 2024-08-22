import BorrowerDashboard from '@apps/borrower/components/home/BorrowerDashboard';
import PortalLayout from '@apps/borrower/components/PortalLayout';
import Scripts from '@components/Scripts';

export default function BorrowerIndex() {
  return (
    <>
      <Scripts />
      <PortalLayout>
        <BorrowerDashboard />
      </PortalLayout>
    </>
  );
}
