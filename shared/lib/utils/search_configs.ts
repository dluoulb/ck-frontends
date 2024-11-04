export const reportsRootConfig = {
  server: {
    apiKey: '',
    nodes: [
      {
        host: process.env.NEXT_PUBLIC_TYPESENSE_SERVER,
        port: Number(process.env.NEXT_PUBLIC_TYPESENSE_PORT),
        protocol: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL,
      },
    ],
  },
  additionalSearchParameters: {
    query_by: 'name, company_name, email, phone',
  },
  collectionSpecificSearchParameters: {
    companies: {
      query_by: 'name, dba, ein, phone',
    },

    orders: {
      query_by:
        'merchant_order_id, order_key, first_name, last_name, email, phone',
    },

    users: {
      query_by: 'company_name, company_id, email, first_name, last_name, phone',
    },

    credit_key_applications: {
      query_by:
        'company_name, company_id, dba, email, business_phone, ein, first_name, last_name, phone',
    },
  },
};
