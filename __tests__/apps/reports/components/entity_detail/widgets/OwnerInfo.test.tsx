import { screen } from '@testing-library/react';

import OwnerInfo from '@apps/reports/components/entity_detail/widgets/OwnerInfo';
import { ReportsContextProvider } from '@contexts/ReportsContext';
import { getUser } from '@lib/actions/users';
import { companyApproved } from '@lib/testing/records';
import { customRender } from '@lib/testing/test-utils';

jest.mock('@lib/actions/users', () => ({
  getUser: jest.fn(),
}));

describe('OwnerInfo Component', () => {
  beforeEach(() => {
    (getUser as jest.Mock).mockReturnValue(companyApproved.borrower);
  });

  test('renders', async () => {
    customRender(
      <ReportsContextProvider entity={companyApproved} entityLoading={false} content="dashboard">
        <OwnerInfo />
      </ReportsContextProvider>,
    );

    const addressElement = await screen.findByText('1234 Tester Lane');
    expect(addressElement).toBeInTheDocument();
  });
});
