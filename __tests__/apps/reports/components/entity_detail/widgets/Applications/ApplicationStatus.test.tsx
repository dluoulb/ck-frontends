import { ApplicationStatus } from '@apps/reports/components/entity_detail/widgets/Applications';
import { application1, application2 } from '@lib/testing/records';
import { render, renders, screen } from '@lib/testing/test-utils';

describe('Application Status Component', () => {
  let props = { app: application1 };
  renders(ApplicationStatus, props);

  test('new app has tooltip', () => {
    render(<ApplicationStatus app={application2} />);
    expect(screen.getByRole('tooltip-component'));
  });

  test('displays netx message', () => {
    render(<ApplicationStatus app={{ ...application1, tier: 'NETX' }} />);
    expect(screen.getByText('Auto-Declined'));
  });
});
