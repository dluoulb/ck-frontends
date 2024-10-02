import { screen } from '@testing-library/react';

import EntityInfo from '@apps/reports/components/entity_detail/widgets/EntityInfo';
import { ReportsContextProvider } from '@contexts/ReportsContext';
import { companyApproved } from '@lib/testing/records';
import { customRender } from '@lib/testing/test-utils';

describe('EntityInfo Component', () => {
  test('renders', () => {
    customRender(
      <ReportsContextProvider
        entity={companyApproved}
        entityLoading={false}
        content="dashboard"
      >
        <EntityInfo />
      </ReportsContextProvider>
    );

    expect(screen.getByText('Gross Annual Revenue:'));
  });
});
