import '@testing-library/jest-dom';

import { render, screen, waitFor } from './test-utils';

type ComponentWithRole = React.ComponentType<any> & { role: string };

export function renders(
  Component: ComponentWithRole,
  props: any = {},
  renderOptions = {}
) {
  return test('Renders', async () => {
    render(<Component {...props} />, renderOptions);

    await waitFor(() => screen.getByRole(Component.role));
  });
}
