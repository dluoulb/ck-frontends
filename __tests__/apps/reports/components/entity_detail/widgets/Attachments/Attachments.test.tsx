import { screen } from '@testing-library/react';

import Attachments from '@apps/reports/components/entity_detail/widgets/Attachments/Attachments';
import { ReportsContextProvider } from '@contexts/ReportsContext';
import { companyApproved } from '@lib/testing/records';
import { customRender } from '@lib/testing/test-utils';

describe('Attachments Component', () => {
  test('renders', () => {
    customRender(
      <ReportsContextProvider
        entity={companyApproved}
        entityLoading={false}
        content="dashboard"
      >
        <Attachments />
      </ReportsContextProvider>
    );

    expect(screen.getByText('Documents'));
  });
});
