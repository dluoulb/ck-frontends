import { marketplace } from '@lib/actions/marketplace';
import MerchantRecord from '@lib/records/merchant';
import { addAuthorization } from '@lib/utils/authorization';

export const getMerchant = async (api, merchant_id) => {
  if (!merchant_id) return;
  const merchant = await api.get(`/api/merchants/${merchant_id}`);
  return new MerchantRecord(merchant.data.data.attributes);
};

export const acceptMerchantInvite = async (api, slug) => {
  if (!slug) return;
  const merchant = await api.post('/api/merchants/accept_merchant_company_connect_invite', {
    slug,
  });
  return new MerchantRecord(merchant.data.data.attributes);
};

export type TopCashbackMerchant = {
  id: string;
  name: string;
  description?: string;
  logoUrl?: string | null;
  cashbackLabel?: string;
  plusBonusLabel?: string;
  slug?: string;
  marketplaceUrl?: string;
};

const marketplaceMerchantsPath = '/marketplace/merchants/top_cashback';

const decodeEscapedUnicode = (value?: string) => {
  if (!value || !value.includes('\\u')) return value;

  return value.replace(/\\u([0-9a-fA-F]{4})/g, (_match, code) =>
    String.fromCharCode(parseInt(code, 16)),
  );
};

const normalizeMerchant = (merchant: any): TopCashbackMerchant | null => {
  if (!merchant) return null;

  const data = merchant.attributes ? { id: merchant.id, ...merchant.attributes } : merchant;
  const id = data.id ? String(data.id) : null;
  const name = decodeEscapedUnicode(data.name || data.merchant_name);
  const description = decodeEscapedUnicode(data.description || data.short_description || undefined);
  const logoUrl = data.logoUrl || data.logo_url || data.logo || null;
  const rawCashback =
    data.cashbackPercentage ??
    data.cashback_percentage ??
    data.cashback ??
    data.max_cashback_percentage ??
    data.affiliateRateAmount;
  const hasCashbackValue =
    rawCashback !== null && rawCashback !== undefined && String(rawCashback).trim() !== '';
  const cashbackValue = hasCashbackValue ? Number(rawCashback) : Number.NaN;
  const plusBonusRate = Number(data.plusBonusRate);

  if (!id || !name) return null;

  const cashbackLabel = Number.isNaN(cashbackValue)
    ? undefined
    : data.affiliateRateKind === 'FLAT'
      ? `$${cashbackValue} cash back`
      : `${cashbackValue}% cash back`;
  const plusBonusLabel =
    Number.isNaN(plusBonusRate) || plusBonusRate < 0 ? undefined : `${plusBonusRate}% Plus Bonus`;

  return {
    id,
    name,
    description,
    logoUrl,
    cashbackLabel,
    plusBonusLabel,
    slug: data.slug,
    marketplaceUrl: data.marketplace_url || data.marketplaceUrl,
  };
};

const extractMerchants = (payload: any): TopCashbackMerchant[] => {
  const rawMerchants =
    payload?.data?.data || payload?.data?.merchants || payload?.data || payload?.merchants || [];

  if (!Array.isArray(rawMerchants)) return [];

  return rawMerchants.map(normalizeMerchant).filter(Boolean);
};

export const getTopCashbackMerchants = async (api): Promise<TopCashbackMerchant[]> => {
  if (!marketplace.apiUrl || !api) return [];

  const requestOptions = await addAuthorization({ headers: {} });
  const response = await api.get(marketplaceMerchantsPath, requestOptions);
  return extractMerchants(response);
};
