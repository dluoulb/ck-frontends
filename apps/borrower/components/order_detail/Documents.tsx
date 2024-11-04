import React from 'react';

import DocumentLink from '@components/DocumentLink';

export default function Documents({ order, documents }) {
  const isPaymentPlan = order?.product_type !== 'mambu_loan';

  const invoiceDocument = documents?.find(
    (d) => d.attributes.file_type === 'invoice_document'
  );
  const net30InvoiceDocument = documents?.find(
    (d) => d.attributes.file_type === 'invoice'
  );

  return (
    <div className="flex flex-col items-end gap-1">
      <DocumentLink
        order={order}
        buttonText={isPaymentPlan ? 'Payment Plan Agreement' : 'Loan Agreement'}
        buttonClass="cursor-pointer text-sm text-primary-blue hover:text-primary-blue-hover border-b border-transparent font-medium hover:border-primary-blue-hover max-w-max"
        type="agreement"
      />
      {invoiceDocument && (
        <DocumentLink
          order={order}
          buttonText="Order Invoice"
          buttonClass="cursor-pointer text-sm text-primary-blue hover:text-primary-blue-hover border-b border-transparent font-medium hover:border-primary-blue-hover max-w-max"
          type="invoice_document"
          invoice_id={invoiceDocument?.id}
        />
      )}
      {net30InvoiceDocument && (
        <DocumentLink
          order={order}
          buttonText="Net30 Order Invoice"
          buttonClass="cursor-pointer text-sm text-primary-blue hover:text-primary-blue-hover border-b border-transparent font-medium hover:border-primary-blue-hover max-w-max"
          type="invoice_document"
          invoice_id={net30InvoiceDocument?.id}
        />
      )}
    </div>
  );
}

Documents.role = 'documents-component';
