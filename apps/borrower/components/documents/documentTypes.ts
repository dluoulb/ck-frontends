export const DOCUMENT_TYPES = [
  { id: 'bank_statements', name: 'Bank Statement' },
  { id: 'invoice', name: 'Invoice' },
  { id: 'id_proof', name: 'ID Proof' },
  { id: 'tax_document', name: 'Tax Document' },
  { id: 'financial_statements', name: 'Financial Statement' },
  { id: 'sos', name: 'Secretary of State Filing' },
  { id: 'fraud_check', name: 'Fraud Check' },
];

export const DOCUMENT_TYPE_LABELS = DOCUMENT_TYPES.reduce(
  (acc, { id, name }) => ({ ...acc, [id]: name }),
  {} as Record<string, string>,
);
