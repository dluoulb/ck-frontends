import { render, screen } from '@testing-library/react';

import EntityInfo from '@apps/reports/components/entity_detail/widgets/EntityInfo';
import { companyApproved } from '@lib/testing/records';

describe('EntityInfo Component', () => {
  test('renders', () => {
    let props = {
      type: 'company',
      entity: companyApproved,
    };
    render(<EntityInfo props={props} />);

    expect(screen.getByText('Gross Annual Revenue:'));
  });
});
