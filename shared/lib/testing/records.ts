const user = {
  id: '5dd38c8cd5691b6c81096c58',
  company_id: 'company123',
  account_id: 'account123',
  first_name: 'Test',
  last_name: 'User',
  email: 'test@creditkey.com',
  phone: '19895551234',
  address: {
    address1: '4223 Thurman Ramp',
    address2: 'Apt. 573',
    city: 'New Keenan',
    state: 'CO',
    zip: '81238',
  },
  role: 'borrower',
};

const consumerAccount = {
  id: user.account_id,
  type: 'account',
  name: user.first_name + ' ' + user.last_name,
  status: 'approved',
  bank_verification_attempts: 0,
  applicant_fico_score: '720',
  tier: 'x2',
  tier_limit: 2500,
  is_past_due: false,
  is_bank_connected: true,
  created_at: '2024-07-20T11:03:19.083-07:00',
  updated_at: '2024-07-20T11:03:19.083-07:00',
};

const companyApproved = {
  id: user.company_id,
  name: 'Widget Maker Co.',
  underwriting_status: 'approved',
  tier: 'tier_y',
  is_past_due: true,
  min_rate: 1.0,
  max_rate: 1.2,
  credit_line: {
    amount: 20000.0,
    remaining_amount: 15000.0,
  },
  address: {
    address1: '123 Super Dr',
    address2: '',
    city: 'Imagine City',
    state: 'ME',
    zip: '99999',
  },
  is_bank_connected: true,
  is_bank_connection_pending: false,
  cta_banners: [
    { name: 'virtual_card', enabled: true },
    { name: 'connect_bank', enabled: false },
    { name: 'cka', enabled: false },
  ],
  borrower: user,
  recharge_settings: [
    {
      merchant_id: 'merchant-a',
      default_term: '12',
    },
  ],
  vc_sub_limits: {
    limit_amount: '25000',
    remaining_limit_amount: '12000',
  },
};

const documentA = {
  file_type: 'bank_statements',
  file_name: 'test_invoice.pdf',
  file_format: 'pdf',
  created_at: '2024-07-19T11:03:19.083-07:00',
};

const documentB = {
  file_type: 'misc',
  file_name: 'misc.pdf',
  file_format: 'pdf',
  created_at: '2024-07-20T11:03:19.083-07:00',
};

const application = {
  id: 'app1',
  company_id: user.company_id,
  created_at: '2024-07-12T13:46:07.434-07:00',
  business_type: 'LLC',
  business_structure: null,
  is_authorized_signer: true,
  has_authorized_purchaser: null,
  first_name: user.first_name,
  last_name: user.last_name,
  ein: '44-3559278',
  email: user.phone,
  title: 'CEO',
  phone: user.phone,
  business_phone: '18001234567',
  birthdate: '1989-08-16',
  company_name: companyApproved.name,
  dba: null,
  raw_annual_revenue: '$1,500,000.00',
  trade_credit_amount_requested: null,
  ssn: '535-11-5603',
  are_additional_owners_confirmed: false,
  sells_restricted_products: false,
  status: 'approved',
  interest_percent: null,
  reasons: [],
  phone_change_attempts: 0,
  industry: null,
  tier: 'A',
  fico_score: 800,
  latest_submission_date: '2024-07-12T13:46:08.638-07:00',
  original_submission_date: '2024-07-12T13:46:08.638-07:00',
  pended_at: null,
  ofac_status: 'No Hit',
  date_established: null,
  applicant_type: 'smb',
  equifax_request_date: '2022-10-12T00:00:00.000-07:00',
  applicant_ip_address: null,
  applied_with_merchant: 'Test Merchant',
  business_address: companyApproved.address,
  personal_address: user.address,
  approved_credit_limit: companyApproved.credit_line.amount,
  gross_annual_revenue: '1500000.00',
  previous_tcl: null,
  beneficial_owners: [],
};

const stats = {
  active: 163,
  closed: 0,
  credit_utilized: 13920,
};

export {
  application,
  companyApproved,
  consumerAccount,
  documentA,
  documentB,
  stats,
  user,
};
