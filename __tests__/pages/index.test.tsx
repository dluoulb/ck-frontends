import { render, screen } from '@testing-library/react';
import Home from '../../pages/index';

describe('Home component', () => {
  test('renders 6 links based on routes', () => {
    render(<Home />);

    const links = screen.getAllByRole('link', { hidden: true });

    expect(links).toHaveLength(6);
  });
});
