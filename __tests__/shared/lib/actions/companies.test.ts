import { getVirtualCards } from '@lib/actions/companies';
import { CardStatus } from '@lib/constants/Enums';
import CompanyVirtualCardRecord from '@lib/records/company_virtual_card';

describe('getVirtualCards', () => {
  test('requests all non-closed virtual card statuses', async () => {
    const api = {
      get: jest.fn().mockResolvedValue({ data: { cards: [] } }),
    };

    await getVirtualCards(api as any, 'company_123');

    expect(api.get).toHaveBeenCalledWith('/api/companies/company_123/virtual_cards/all', {
      params: {
        status: [CardStatus.ACTIVE, CardStatus.STOLEN, CardStatus.SUSPEND, CardStatus.PENDING],
      },
    });
  });

  test('maps returned cards to CompanyVirtualCardRecord instances', async () => {
    const api = {
      get: jest.fn().mockResolvedValue({
        data: { cards: [{ id: 'card_1', status: 'ACTIVE' }] },
      }),
    };

    const cards = await getVirtualCards(api as any, 'company_123');

    expect(cards).toHaveLength(1);
    expect(cards?.[0]).toBeInstanceOf(CompanyVirtualCardRecord);
    expect(cards?.[0]).toMatchObject({ id: 'card_1', status: 'ACTIVE' });
  });
});
