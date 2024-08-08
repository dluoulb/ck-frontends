import '@testing-library/jest-dom';

import DownloadAgreement from '@apps/reports/components/order_detail/DownloadAgreement';
import { getAgreement } from '@lib/actions/orders';
import { orderA } from '@lib/testing/records';
import {
  act,
  customRender,
  fireEvent,
  renders,
  screen,
} from '@lib/testing/test-utils';

jest.mock('@lib/actions/orders', () => ({
  getAgreement: jest.fn(),
}));

describe('DownloadAgreement Component', () => {
  renders(DownloadAgreement);

  test('sets loading to true when agreement is being fetched', async () => {
    (getAgreement as jest.Mock).mockReturnValue({
      start: jest.fn(() => new Promise(() => {})), // Promise that doesn't resolve yet
    });

    customRender(
      <DownloadAgreement order={orderA} buttonText="Payment Plan" />
    );

    const downloadElement = screen.getByRole('download-agreement-component');
    await act(async () => fireEvent.click(downloadElement));

    expect(screen.getByRole('loading')).toBeInTheDocument();
  });
});
