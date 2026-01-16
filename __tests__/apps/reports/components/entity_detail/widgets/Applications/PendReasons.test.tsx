import { PendReasons } from '@apps/reports/components/entity_detail/widgets/Applications';
import { application1 } from '@lib/testing/records';
import { render, renders, screen } from '@lib/testing/test-utils';

describe('Pend Reasons Component', () => {
  const props = { app: application1 };
  renders(PendReasons, props);

  test('displays pend reasons', () => {
    render(<PendReasons app={{ ...application1, reasons: ['kyc_pend', 'lexis_pend'] }} />);
    expect(screen.getByText('kyc pend, lexis pend'));
  });

  test('displays netx message', () => {
    render(<PendReasons app={{ ...application1, tier: 'NETX' }} />);
    expect(screen.getByText('N/A - NetX Applicant'));
  });
});
