export const buildRequestPayload = (payloadValues, user) => {
  return {
    cart_items: [
      {
        sku: 1,
        name: `${payloadValues?.merchant_name} order`,
        price: parseFloat(payloadValues?.order_amount?.replace(/[^.0-9]/g, '')),
        quantity: 1,
      },
    ],
    billing_address: {
      first_name: user?.first_name,
      last_name: user?.last_name,
      email: user?.email,
      address1: user?.address.address1,
      address2: user?.address.address2,
      city: user?.address.city,
      state: user?.address.state,
      zip: user?.address.zip,
      phone_number: user?.phone_number,
    },
    charges: {
      total: parseFloat(payloadValues?.order_amount?.replace(/[^.0-9]/g, '')),
      shipping: 0,
      tax: 0,
      discount_amount: 0,
      grand_total: parseFloat(
        payloadValues?.order_amount.replace(/[^.0-9]/g, '')
      ),
    },
    merchant_data: {
      merchant_name: payloadValues?.merchant_name,
      merchant_url: payloadValues?.merchant_url,
      virtual_card: true,
      promo_id: payloadValues?.bypass ? null : payloadValues?.promo_id,
    },
    mode: 'redirect',
  };
};

export const startVirtualCardOrder = (api, order_details) => {
  return api.post(
    `/ecomm/begin_standalone_checkout?public_key=${process.env.REACT_APP_VC_MERCHANT_KEY}&shared_secret=${process.env.REACT_APP_VC_MERCHANT_SECRET}`,
    order_details
  );
};
