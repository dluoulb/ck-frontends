import { AddressDetails } from '@apps/reports/components/entity_detail/widgets/Applications';
import { companyApproved } from '@lib/testing/records';
import { render, renders, screen } from '@lib/testing/test-utils';

describe('Address Details Component', () => {
  let props = { type: 'company', appAddress: companyApproved.address };
  renders(AddressDetails, props);

  test('displays not provided', () => {
    render(<AddressDetails type="company" appAddress={null} />);
    expect(screen.getByText('Not Provided'));
  });

  test('displays netx message', () => {
    render(<AddressDetails type="company" appAddress={null} tooltip={true} />);
    expect(screen.getByText('N/A - NetX Applicant'));
  });
});
