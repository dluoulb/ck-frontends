import '@testing-library/jest-dom';

import { customRender, screen, waitFor } from './test-utils';

type ComponentWithRole = React.ComponentType<any> & { role: string };

export function renders(
  Component: ComponentWithRole,
  props: any = {},
  renderOptions = {}
) {
  return test(`Renders ${Component.role}`, async () => {
    customRender(<Component {...props} />, renderOptions);

    await waitFor(() => screen.getByRole(Component.role));
  });
}
