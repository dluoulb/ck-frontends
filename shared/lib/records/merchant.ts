import { server } from '@lib/constants/SiteVariables';
import { removeNulls } from '@lib/utils/record_utils';

export default class MerchantRecord {
  id: string | null;
  platform: string;
  name: string;
  supports_standalone_csr: string | null;
  support_email: string;
  active_promo: {};
  promos: any[];
  public_key: string;
  url: string;
  restricted_industry: string | null;
  slug: string;
  default_checkout_method: string | null;

  constructor(data) {
    const { learn_more_link, ...filteredData } = removeNulls(data);
    Object.assign(this, filteredData);
  }

  get learn_more_link() {
    let learnMoreSlug;

    this.slug === 'not-used' || this.slug === ''
      ? (learnMoreSlug = 'learn-more')
      : (learnMoreSlug = this.slug);

    return server(false) + '/' + learnMoreSlug;
  }
}
