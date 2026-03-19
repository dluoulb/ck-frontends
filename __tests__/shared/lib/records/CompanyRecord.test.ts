import { amazonPhysicalCardTest } from '@lib/constants/SiteVariables';
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
