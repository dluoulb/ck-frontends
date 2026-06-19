import { amazonPhysicalCardTest, plusCohorts } from '@lib/constants/SiteVariables';
import type CompanyRecordType from '@lib/records/company';
import { companyApproved } from '@lib/testing/records';

const companyData = (activeCohortsByType: Record<string, string> = {}) => ({
  ...companyApproved,
  active_cohorts_by_type: activeCohortsByType,
});

const loadCompanyRecord = (flagEnabled: boolean): typeof CompanyRecordType => {
  const orig = process.env.NEXT_PUBLIC_AMAZON_PHYSICAL_CARD_TEST_ENABLED;
  process.env.NEXT_PUBLIC_AMAZON_PHYSICAL_CARD_TEST_ENABLED = flagEnabled ? 'true' : '';
  let Record: typeof CompanyRecordType;
  jest.isolateModules(() => {
    Record = require('@lib/records/company').default;
  });
  if (orig === undefined) {
    delete process.env.NEXT_PUBLIC_AMAZON_PHYSICAL_CARD_TEST_ENABLED;
  } else {
    process.env.NEXT_PUBLIC_AMAZON_PHYSICAL_CARD_TEST_ENABLED = orig;
  }
  return Record!;
};

const loadCompanyRecordWithPlusFlag = (plusFlagEnabled: boolean): typeof CompanyRecordType => {
  const orig = process.env.NEXT_PUBLIC_PLUS_ENABLED;
  process.env.NEXT_PUBLIC_PLUS_ENABLED = plusFlagEnabled ? 'true' : '';
  let Record: typeof CompanyRecordType;
  jest.isolateModules(() => {
    Record = require('@lib/records/company').default;
  });
  if (orig === undefined) {
    delete process.env.NEXT_PUBLIC_PLUS_ENABLED;
  } else {
    process.env.NEXT_PUBLIC_PLUS_ENABLED = orig;
  }
  return Record!;
};

describe('CompanyRecord#isAmazonExclusive', () => {
  let CompanyRecord: typeof CompanyRecordType;

  beforeAll(() => {
    CompanyRecord = loadCompanyRecord(true);
  });

  it('returns true when in the amazon_exclusive cohort', () => {
    const company = new CompanyRecord(
      companyData({ [amazonPhysicalCardTest.type]: amazonPhysicalCardTest.cohort }),
    );
    expect(company.isAmazonExclusive).toBe(true);
  });

  it('returns false when active_cohorts_by_type is empty', () => {
    expect(new CompanyRecord(companyData()).isAmazonExclusive).toBeFalsy();
  });

  it('returns false when in a different cohort', () => {
    const company = new CompanyRecord(
      companyData({ [amazonPhysicalCardTest.type]: 'some_other_cohort' }),
    );
    expect(company.isAmazonExclusive).toBeFalsy();
  });

  it('returns false when active_cohorts_by_type is undefined', () => {
    const company = new CompanyRecord({
      ...companyApproved,
      active_cohorts_by_type: undefined,
    });
    expect(company.isAmazonExclusive).toBeFalsy();
  });
});

describe('CompanyRecord#physical_card_enabled', () => {
  describe('when the feature flag is disabled', () => {
    let CompanyRecord: typeof CompanyRecordType;

    beforeAll(() => {
      CompanyRecord = loadCompanyRecord(false);
    });

    it('returns true regardless of cohort membership', () => {
      const company = new CompanyRecord(
        companyData({ [amazonPhysicalCardTest.type]: amazonPhysicalCardTest.cohort }),
      );
      expect(company.physical_card_enabled).toBe(true);
    });

    it('returns true when active_cohorts_by_type is empty', () => {
      expect(new CompanyRecord(companyData()).physical_card_enabled).toBe(true);
    });
  });

  describe('when the feature flag is enabled', () => {
    let CompanyRecord: typeof CompanyRecordType;

    beforeAll(() => {
      CompanyRecord = loadCompanyRecord(true);
    });

    it('returns false when in the amazon_exclusive cohort', () => {
      const company = new CompanyRecord(
        companyData({ [amazonPhysicalCardTest.type]: amazonPhysicalCardTest.cohort }),
      );
      expect(company.physical_card_enabled).toBe(false);
    });

    it('returns true when active_cohorts_by_type is empty', () => {
      expect(new CompanyRecord(companyData()).physical_card_enabled).toBe(true);
    });

    it('returns true when in a different cohort type', () => {
      const company = new CompanyRecord(companyData({ pricing: 'some_cohort' }));
      expect(company.physical_card_enabled).toBe(true);
    });

    it('returns true when in the right type but a different cohort', () => {
      const company = new CompanyRecord(
        companyData({ [amazonPhysicalCardTest.type]: 'some_other_cohort' }),
      );
      expect(company.physical_card_enabled).toBe(true);
    });

    it('returns true when active_cohorts_by_type is undefined', () => {
      const company = new CompanyRecord({
        ...companyApproved,
        active_cohorts_by_type: undefined,
      });
      expect(company.physical_card_enabled).toBe(true);
    });
  });
});

describe('CompanyRecord#isNetX', () => {
  let CompanyRecord: typeof CompanyRecordType;

  beforeAll(() => {
    CompanyRecord = loadCompanyRecord(false);
  });

  it('returns true when tier is NETX', () => {
    const company = new CompanyRecord({ ...companyApproved, tier: 'NETX' });
    expect(company.isNetX).toBe(true);
  });

  it('returns false when tier is not NETX', () => {
    const company = new CompanyRecord({ ...companyApproved, tier: 'tier_y' });
    expect(company.isNetX).toBe(false);
  });

  it('returns false when tier is undefined', () => {
    const company = new CompanyRecord({ ...companyApproved, tier: undefined });
    expect(company.isNetX).toBe(false);
  });
});

describe('CompanyRecord#plus_enabled', () => {
  describe('when plusEnabled feature flag is off', () => {
    let CompanyRecord: typeof CompanyRecordType;

    beforeAll(() => {
      CompanyRecord = loadCompanyRecordWithPlusFlag(false);
    });

    it('returns false even for a test group member', () => {
      const company = new CompanyRecord({
        ...companyApproved,
        active_cohorts: [plusCohorts[0]],
      });
      expect(company.plus_enabled).toBe(false);
    });
  });

  describe('when plusEnabled feature flag is on', () => {
    let CompanyRecord: typeof CompanyRecordType;

    beforeAll(() => {
      CompanyRecord = loadCompanyRecordWithPlusFlag(true);
    });

    it('returns true for a test group member', () => {
      const company = new CompanyRecord({
        ...companyApproved,
        active_cohorts: [plusCohorts[0]],
      });
      expect(company.plus_enabled).toBe(true);
    });

    it('returns false when not in the test group', () => {
      const company = new CompanyRecord({
        ...companyApproved,
        active_cohorts: [],
      });
      expect(company.plus_enabled).toBe(false);
    });
  });
});

describe('CompanyRecord#underwriting', () => {
  let CompanyRecord: typeof CompanyRecordType;

  beforeAll(() => {
    CompanyRecord = loadCompanyRecord(false);
  });

  it('keeps the plaid item id without retaining the plaid access token', () => {
    const company = new CompanyRecord({
      ...companyApproved,
      underwriting: {
        plaid_item_id: 'item_123',
        plaid_access_token: 'access-sandbox-secret',
      },
    });

    expect(company.underwriting).toEqual({
      plaid_item_id: 'item_123',
    });
  });

  it('preserves unrelated undefined fields while removing the plaid access token', () => {
    const company = new CompanyRecord({
      ...companyApproved,
      underwriting: {
        plaid_access_token: 'access-sandbox-secret',
      },
      non_secret_flag: undefined,
    });

    expect(Object.prototype.hasOwnProperty.call(company, 'non_secret_flag')).toBe(true);
    expect(company.underwriting).toEqual({});
  });
});
