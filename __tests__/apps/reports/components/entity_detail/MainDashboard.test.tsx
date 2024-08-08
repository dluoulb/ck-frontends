import MainDashboard from '@apps/reports/components/entity_detail/MainDashboard';
import {
  application1,
  application2,
  companyApproved,
  documentA,
  documentB,
  stats,
} from '@lib/testing/records';
import { customRender, screen } from '@lib/testing/test-utils';

describe('Main Dashboard Component', () => {
  test('displays dashboard', () => {
    let props = {
      type: 'company',
      entity: companyApproved,
      applications: [application1, application2],
      documents: [documentA, documentB],
      stats: stats,
      errors: {},
    };
    customRender(<MainDashboard props={props} />);

    expect(screen.getByRole('main-dashboard-component'));
  });
});
