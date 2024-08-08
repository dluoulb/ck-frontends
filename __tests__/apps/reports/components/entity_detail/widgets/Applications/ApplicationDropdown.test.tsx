import { render, screen } from '@testing-library/react';

import { ApplicationDropdown, listOptions } from '@apps/reports/components/entity_detail/widgets/Applications';
import { application1, application2 } from '@lib/testing/records';

describe('Application Dropdown Component', () => {
  test('renders', () => {
    let props = {
      listOptions: listOptions([application1, application2]),
      contentItems: application1.id,
      setContent: jest.fn(),
    };
    render(<ApplicationDropdown {...props} />);

    expect(screen.getByText('Most Recent: approved - 7/12/2024'));
  });
});
