import React, { useMemo, useState } from 'react';
import { faChevronDown } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Select from '@radix-ui/react-select';

import { useBorrowerDeps } from '@contexts/BorrowerContext';
import useApi from '@hooks/useApi';
import useToast from '@hooks/useToast';
import { updatePaymentTerms } from '@lib/actions/orders';

type ApprovedTerm = {
  available: boolean;
  term: number;
  term_period: string;
};

export default function TermsColumn(props: {
  order: any;
  terms: ApprovedTerm[];
}) {
  const { order, terms = [] } = props;
  const api = useApi();
  const { makeToast } = useToast();
  const { refetchOrders } = useBorrowerDeps();

  const currentInstallments = Number(order?.product?.installments ?? 0);
  const [value, setValue] = useState<string>(
    currentInstallments ? String(currentInstallments) : ''
  );

  const options = useMemo(
    () =>
      (terms ?? [])
        .filter((t) => t?.available)
        .map((t) => ({
          label: `${t.term} ${t.term > 1 ? 'months' : 'month'}`,
          value: String(t.term),
        })),
    [terms]
  );

  const label = useMemo(() => {
    const n = Number(value);
    return n ? `${n} ${n === 1 ? 'month' : 'months'}` : '—';
  }, [value]);

  const handleChange = async (newValue: string) => {
    const newTerm = Number(newValue);
    if (!newTerm || newTerm === currentInstallments) {
      setValue(String(currentInstallments));
      return;
    }

    try {
      await updatePaymentTerms(api, order.id, newTerm);
      setValue(String(newTerm));
      makeToast(
        `Updated ${order.order_key} terms to ${newTerm} month${newTerm > 1 ? 's' : ''}`,
        'success'
      );
      await refetchOrders();
    } catch (e) {
      makeToast(
        'An error occurred. Please contact our support team (support@creditkey.com)',
        'error'
      );
      setValue(String(currentInstallments));
    }
  };

  return (
    <Select.Root value={value} onValueChange={handleChange}>
      <Select.Trigger className="inline-flex items-center gap-2 border rounded px-2 py-1 text-sm font-medium cursor-pointer bg-white">
        <Select.Value>{label}</Select.Value>
        <Select.Icon>
          <FontAwesomeIcon
            icon={faChevronDown}
            className="w-3 h-3 text-gray-400"
          />
        </Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="bg-white border rounded shadow-lg z-100">
          <Select.Viewport>
            {options.map((opt) => (
              <Select.Item
                key={opt.value}
                value={opt.value}
                className="px-3 py-1 cursor-pointer hover:bg-gray-100"
              >
                <Select.ItemText>{opt.label}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}
