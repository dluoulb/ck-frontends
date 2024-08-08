import { render, screen } from '@testing-library/react';

import OwnerInfo from '@apps/reports/components/entity_detail/widgets/OwnerInfo';
import { application, companyApproved, user } from '@lib/testing/records';

describe('OwnerInfo Component', () => {
  test('renders', () => {
    let props = {
      type: 'company',
      entity: companyApproved,
      ownerAddress: user.address,
      applications: [application],
    };
    render(<OwnerInfo props={props} />);

    expect(screen.getByText('1234 Tester Lane'));
  });
});
