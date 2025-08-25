import React from 'react';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Collapsible from '@radix-ui/react-collapsible';

import DocumentLink from '@components/DocumentLink';

export default function Documents({ order, documents }) {
  const isPaymentPlan = order?.product_type !== 'mambu_loan';

  const invoiceDocument = documents?.find(
    (d) => d.attributes.file_type === 'invoice_document'
  );

  const net30InvoiceDocument = documents
    ?.filter((d) => d.attributes.file_type === 'invoice')
    ?.sort(
      (a, b) =>
        new Date(b.attributes.created_at as string).getTime() -
        new Date(a.attributes.created_at as string).getTime()
    )[0];

  const [open, setOpen] = React.useState(false);

  return (
    <Collapsible.Root open={open} onOpenChange={setOpen}>
      <Collapsible.Trigger asChild>
        <button
          className="flex items-center gap-2 text-primary text-sm font-medium mb-2 text-left"
          type="button"
        >
          Related Documents
          {open ? (
            <FontAwesomeIcon icon={faChevronUp} />
          ) : (
            <FontAwesomeIcon icon={faChevronDown} />
          )}
        </button>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <div className="flex flex-col gap-1">
          <DocumentLink
            order={order}
            buttonText={
              isPaymentPlan ? 'Payment Plan Agreement' : 'Loan Agreement'
            }
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
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

Documents.role = 'documents-component';
