import { render, screen } from '@testing-library/react';

import SearchTab from '@apps/reports/components/SearchTab';

describe('Shared SearchTab Component', () => {
  test('renders', () => {
    render(<SearchTab content="companies" setContent={jest.fn()} type="companies" />);

    expect(screen.getByText('companies'));
  });
});
