import { useQuery } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import useEntityDependencies from '@apps/reports/hooks/useEntityDependencies';
import { apiResponse } from '@lib/testing/api_response';
import {
  application,
  consumerAccount,
  documentA,
  documentB,
  stats,
  user,
} from '@lib/testing/records';
import { customRender, screen, waitFor } from '@lib/testing/test-utils';
import EntityIndex from '@pages/reports/[type]/[id]';

jest.mock('@lib/actions/entities', () => ({
  getAccount: jest.fn(),
  getCompany: jest.fn(),
}));

jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQuery: jest.fn(),
}));

jest.mock('@apps/reports/hooks/useEntityDependencies');

test('fetches and displays account entity', async () => {
  (useQuery as jest.Mock).mockReturnValue({
    data: apiResponse(consumerAccount),
    error: null,
    isLoading: false,
  });

  (usePathname as jest.Mock).mockReturnValue('/reports/accounts/123');

  // Mock the useQuery calls within useEntityDependencies
  (useQuery as jest.Mock).mockImplementation((options) => {
    if (options.queryKey[0] === 'users') {
      return {
        data: { attributes: user.address },
        error: null,
        isLoading: false,
      };
    } else if (options.queryKey[0] === 'applications') {
      return {
        data: [{ attributes: application }],
        error: null,
        isLoading: false,
      };
    } else if (options.queryKey[0] === 'stats') {
      return { data: stats, error: null, isLoading: false };
    } else if (options.queryKey[0] === 'documents') {
      return {
        data: [{ documentA }, { documentB }],
        error: null,
        isLoading: false,
      };
    }
    return { data: null, error: null, isLoading: false };
  });

  // Mock the useEntityDependencies hook to return the desired props
  (useEntityDependencies as jest.Mock).mockReturnValue({
    entityProps: {
      type: consumerAccount.type,
      entity: consumerAccount,
      ownerAddress: user.address,
      applications: [application],
      stats: stats,
      documents: [documentA, documentB],
      errors: {},
      hasErrors: false,
      isLoading: false,
    },
  });

  customRender(<EntityIndex />, {
    routerQuery: {
      id: consumerAccount.id,
      type: 'accounts',
      content: 'dashboard',
    },
  });

  const container = screen.getByTestId('container');

  expect(container).toBeInTheDocument();
  expect(container).toHaveClass('max-w-[90%]', 'mx-auto');
});
