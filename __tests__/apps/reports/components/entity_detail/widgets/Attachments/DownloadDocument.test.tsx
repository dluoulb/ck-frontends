import '@testing-library/jest-dom';

import DownloadDocument from '@apps/reports/components/entity_detail/widgets/Attachments/table/DownloadDocument';
import { getEntityDocument } from '@lib/actions/entities';
import { documentA } from '@lib/testing/records';
import {
  act,
  customRender,
  fireEvent,
  renders,
  screen,
} from '@lib/testing/test-utils';

jest.mock('@lib/actions/entities', () => ({
  getEntityDocument: jest.fn(),
}));

describe('DownloadDocument Component', () => {
  renders(DownloadDocument);

  test('sets loading to true when document is being fetched', async () => {
    (getEntityDocument as jest.Mock).mockReturnValue({
      start: jest.fn(() => new Promise(() => {})), // Promise that doesn't resolve yet
    });

    customRender(<DownloadDocument document_id={documentA.id} />);

    const downloadElement = screen.getByRole('download-document-component');
    await act(async () => fireEvent.click(downloadElement));

    expect(screen.getByRole('loading')).toBeInTheDocument();
  });
});
