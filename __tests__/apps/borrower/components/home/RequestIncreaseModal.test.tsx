import React, { useState } from 'react';

import RequestIncreaseModal from '@apps/borrower/components/home/RequestIncreaseModal';
import { act, customRender, fireEvent, screen, waitFor } from '@lib/testing/test-utils';

const mockCreateLimitIncreaseRequest = jest.fn();

jest.mock('@components/modals/ModalWrapper', () => ({
  __esModule: true,
  default: ({ children, header, isModalActive, toggleModal, disableDismiss }) =>
    isModalActive ? (
      <div>
        <div>{header}</div>
        <button type="button" onClick={toggleModal} disabled={disableDismiss}>
          Close modal
        </button>
        {children}
      </div>
    ) : null,
}));

jest.mock('@hooks/useApi', () => ({
  __esModule: true,
  default: jest.fn(() => ({})),
}));

jest.mock('@lib/actions/companies', () => ({
  ...jest.requireActual('@lib/actions/companies'),
  createLimitIncreaseRequest: (...args) => mockCreateLimitIncreaseRequest(...args),
}));

describe('RequestIncreaseModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders first-step UI with current credit limit and dollar-prefixed amount input', () => {
    customRender(
      <RequestIncreaseModal
        companyId="123"
        currentCreditLimit={22500}
        isModalActive
        toggleModal={jest.fn()}
      />,
    );

    expect(
      screen.getByRole('heading', { name: 'Request Credit Line Increase' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('See if you qualify for a larger credit line in just a few minutes.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Current Credit Limit')).toBeInTheDocument();
    expect(screen.getByText('$22,500.00')).toBeInTheDocument();
    expect(
      screen.getByLabelText('What is the additional amount you are requesting?'),
    ).toHaveAttribute('placeholder', '$');
    expect(screen.getByLabelText(/comments/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
  });

  test('keeps Continue disabled when the request cannot be submitted without a company id', () => {
    customRender(
      <RequestIncreaseModal currentCreditLimit={20000} isModalActive toggleModal={jest.fn()} />,
    );

    fireEvent.change(screen.getByLabelText('What is the additional amount you are requesting?'), {
      target: { value: '25000' },
    });

    const continueButton = screen.getByRole('button', { name: 'Continue' });

    expect(continueButton).toBeDisabled();

    fireEvent.click(continueButton);

    expect(mockCreateLimitIncreaseRequest).not.toHaveBeenCalled();
  });

  test('ignores stale submit success after the modal closes during submit', async () => {
    let resolveRequest: (() => void) | undefined;
    const requestPromise = new Promise<void>((resolve) => {
      resolveRequest = resolve;
    });
    mockCreateLimitIncreaseRequest.mockReturnValue(requestPromise);

    function RequestIncreaseModalHarness() {
      const [isModalActive, setIsModalActive] = useState(true);

      return (
        <div>
          <button type="button" onClick={() => setIsModalActive(true)}>
            Open modal
          </button>
          <button type="button" onClick={() => setIsModalActive(false)}>
            Force close modal
          </button>
          <RequestIncreaseModal
            companyId="123"
            currentCreditLimit={20000}
            isModalActive={isModalActive}
            toggleModal={() => setIsModalActive(false)}
          />
        </div>
      );
    }

    customRender(<RequestIncreaseModalHarness />);

    fireEvent.change(screen.getByLabelText('What is the additional amount you are requesting?'), {
      target: { value: '25000' },
    });
    fireEvent.change(screen.getByLabelText(/comments/i), {
      target: { value: 'Need additional purchasing flexibility' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    await waitFor(() => {
      expect(mockCreateLimitIncreaseRequest).toHaveBeenCalledWith(
        expect.anything(),
        '123',
        25000,
        'Need additional purchasing flexibility',
      );
    });

    fireEvent.click(screen.getByRole('button', { name: 'Force close modal' }));

    expect(screen.queryByText('Request Credit Line Increase')).not.toBeInTheDocument();

    await act(async () => {
      resolveRequest?.();
      await requestPromise;
    });

    fireEvent.click(screen.getByRole('button', { name: 'Open modal' }));

    expect(screen.queryByText(/request submitted/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText('What is the additional amount you are requesting?')).toHaveValue(
      '',
    );
    expect(screen.getByLabelText(/comments/i)).toHaveValue('');
    expect(screen.getByRole('button', { name: 'Continue' })).toBeDisabled();
  });

  test('prevents dismissing the modal while a submit is in flight', async () => {
    let resolveRequest: (() => void) | undefined;
    const requestPromise = new Promise<void>((resolve) => {
      resolveRequest = resolve;
    });
    mockCreateLimitIncreaseRequest.mockReturnValue(requestPromise);

    customRender(
      <RequestIncreaseModal
        companyId="123"
        currentCreditLimit={20000}
        isModalActive
        toggleModal={jest.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText('What is the additional amount you are requesting?'), {
      target: { value: '25000' },
    });
    fireEvent.change(screen.getByLabelText(/comments/i), {
      target: { value: 'Need additional purchasing flexibility' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    await waitFor(() => {
      expect(mockCreateLimitIncreaseRequest).toHaveBeenCalledWith(
        expect.anything(),
        '123',
        25000,
        'Need additional purchasing flexibility',
      );
    });

    expect(screen.getByRole('button', { name: 'Close modal' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Submitting...' })).toBeDisabled();
    expect(mockCreateLimitIncreaseRequest).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolveRequest?.();
      await requestPromise;
    });
  });
});
