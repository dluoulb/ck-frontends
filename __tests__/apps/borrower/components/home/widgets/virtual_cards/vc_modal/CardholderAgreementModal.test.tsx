import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import CardholderAgreementModal from '@apps/borrower/components/home/widgets/virtual_cards/vc_modal/CardholderAgreementModal';
import { useEntity } from '@contexts/EntityContext';
import { useUser } from '@contexts/UserContext';
import { CardType } from '@lib/constants/Enums';
import { captureEvent } from '@lib/posthog';

jest.mock('@contexts/EntityContext');
jest.mock('@contexts/UserContext');
jest.mock('@lib/posthog', () => ({
  captureEvent: jest.fn(),
}));
jest.mock('@lib/utils/fullstory', () =>
  jest.fn().mockImplementation(() => ({
    acceptCardholderAgreementEvent: jest.fn(),
  })),
);

const mockUseEntity = useEntity as jest.MockedFunction<typeof useEntity>;
const mockUseUser = useUser as jest.MockedFunction<typeof useUser>;
const mockCaptureEvent = captureEvent as jest.MockedFunction<typeof captureEvent>;

describe('CardholderAgreementModal', () => {
  const next = jest.fn();
  const goTo = jest.fn();
  const toggleModal = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseEntity.mockReturnValue({
      entity: {
        id: 'entity-1',
        is_bank_connected: false,
      } as any,
    } as any);
    mockUseUser.mockReturnValue({ user: { id: 'user-1', full_name: 'Test User' } } as any);
  });

  test.each([CardType.VIRTUAL, CardType.PHYSICAL] as const)(
    'captures cardholder agreement acceptance with the %s card type',
    (cardType) => {
      render(
        <CardholderAgreementModal
          next={next}
          goTo={goTo}
          toggleModal={toggleModal}
          cardType={cardType}
        />,
      );

      fireEvent.click(screen.getByRole('checkbox'));
      fireEvent.click(screen.getByLabelText('agree-to-cardholder-agreement-button'));

      expect(mockCaptureEvent).toHaveBeenCalledWith('accepted_cardholder_agreement', {
        user_id: 'user-1',
        company_id: 'entity-1',
        name: 'Test User',
        card_type: cardType,
      });
      expect(next).toHaveBeenCalledTimes(1);
      expect(goTo).not.toHaveBeenCalled();
    },
  );
});
