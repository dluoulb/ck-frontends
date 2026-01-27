import MultiUseVirtualCard from '@apps/borrower/components/multi_use_virtual_card';
import { useEntity } from '@contexts/EntityContext';
import { companyApproved } from '@lib/testing/records';
import { customRender, screen } from '@lib/testing/test-utils';

jest.mock('@contexts/EntityContext');

const mockUseEntity = useEntity as jest.MockedFunction<typeof useEntity>;

describe('MultiUseVirtualCard Component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('displays loading indicator while entity is loading', () => {
    mockUseEntity.mockReturnValue({
      entity: null,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: true,
    });

    customRender(<MultiUseVirtualCard />);

    expect(screen.getByRole('loading')).toBeInTheDocument();
  });

  test('displays loading indicator when entity is null and not loading', () => {
    mockUseEntity.mockReturnValue({
      entity: null,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    });

    customRender(<MultiUseVirtualCard />);

    expect(screen.getByRole('loading')).toBeInTheDocument();
  });

  test('displays 404 error when entity is loaded but vc_enabled is false', () => {
    const entityWithoutVC = { ...companyApproved, vc_enabled: false };

    mockUseEntity.mockReturnValue({
      entity: entityWithoutVC,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    });

    customRender(<MultiUseVirtualCard />);

    // Next.js Error component with 404 status code
    expect(screen.getByText('404')).toBeInTheDocument();
  });

  test('displays the virtual card page when entity is loaded and vc_enabled is true', () => {
    const entityWithVC = { ...companyApproved, vc_enabled: true };

    mockUseEntity.mockReturnValue({
      entity: entityWithVC,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: false,
    });

    customRender(<MultiUseVirtualCard />);

    expect(screen.getByTestId('container')).toBeInTheDocument();
    expect(screen.getByText('Credit Key Card')).toBeInTheDocument();
  });

  test('shows loading indicator even when entityLoading is true and entity exists', () => {
    const entityWithVC = { ...companyApproved, vc_enabled: true };

    mockUseEntity.mockReturnValue({
      entity: entityWithVC,
      setEntity: jest.fn(),
      fetchEntity: jest.fn(),
      entityError: null,
      entityLoading: true,
    });

    customRender(<MultiUseVirtualCard />);

    // Should show loading, not the page or 404
    expect(screen.getByRole('loading')).toBeInTheDocument();
    expect(screen.queryByTestId('container')).not.toBeInTheDocument();
  });
});
