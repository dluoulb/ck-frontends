import { render, screen } from '@testing-library/react';

import NoDataError from '@apps/reports/components/NoDataError';

describe('NoDataError Component', () => {
  test('renders', () => {
    render(<NoDataError tag="company" />);

    expect(screen.getByText('No company found'));
  });
});
