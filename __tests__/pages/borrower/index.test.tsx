import { act, customRender, screen } from '@lib/testing/test-utils';
import BorrowerIndex from '@pages/borrower/index';

describe('Borrower Portal Home Page', () => {
  test('displays main dashboard', async () => {
    customRender(<BorrowerIndex />, { withBorrowerProviders: true });

    act(() => {
      expect(screen.getByText('Borrower Dashboard'));
    });
  });
});
