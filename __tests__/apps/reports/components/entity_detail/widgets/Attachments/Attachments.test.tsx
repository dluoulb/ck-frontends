import { screen } from '@testing-library/react';

import Attachments from '@apps/reports/components/entity_detail/widgets/Attachments/Attachments';
import { documentA, documentB } from '@lib/testing/records';
import { customRender } from '@lib/testing/test-utils';

describe('Attachments Component', () => {
  test('renders', () => {
    let props = {
      documents: [documentA, documentB],
      errors: {},
    };
    customRender(<Attachments props={props} />);

    expect(screen.getByText('Documents'));
  });
});
