import type { AxiosInstance } from 'axios';

import { checkTrialEligibility } from '@lib/actions/plus';

const buildApi = (response: unknown, status = 200) =>
  ({
    get: jest.fn().mockResolvedValue({ data: response, status }),
  }) as unknown as AxiosInstance;

const buildFailingApi = (error: unknown) =>
  ({
    get: jest.fn().mockRejectedValue(error),
  }) as unknown as AxiosInstance;

describe('checkTrialEligibility', () => {
  const companyId = 'company_123';

  test('returns true when endpoint responds with eligible: true', async () => {
    const api = buildApi({ eligible_for_trial: true });

    const result = await checkTrialEligibility(api, companyId);

    expect(result).toBe(true);
    expect(api.get).toHaveBeenCalledWith(
      `/api/subscriptions/eligible_for_trial?company_id=${companyId}`,
    );
  });

  test('returns false when endpoint responds with eligible: false', async () => {
    const api = buildApi({ eligible_for_trial: false });

    const result = await checkTrialEligibility(api, companyId);

    expect(result).toBe(false);
  });

  test('returns false when eligible field is missing from response', async () => {
    const api = buildApi({});

    const result = await checkTrialEligibility(api, companyId);

    expect(result).toBe(false);
  });

  test('returns false when the request fails', async () => {
    const api = buildFailingApi(new Error('Network error'));

    const result = await checkTrialEligibility(api, companyId);

    expect(result).toBe(false);
  });

  test('returns false when the response data is null', async () => {
    const api = buildApi(null);

    const result = await checkTrialEligibility(api, companyId);

    expect(result).toBe(false);
  });
});
