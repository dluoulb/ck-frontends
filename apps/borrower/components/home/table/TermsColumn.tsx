import React, { useMemo, useState } from 'react';
import { faChevronDown } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as Select from '@radix-ui/react-select';

export default function TermsColumn(props: {
  order: any;
  openModalForLoan: (loan: any) => void;
}) {
  const { order, openModalForLoan } = props;

  const currentInstallments = Number(order?.product?.installments ?? 0);
  const [value, setValue] = useState<string>(
    currentInstallments ? String(currentInstallments) : ''
  );

  const options = useMemo(
    () =>
      (order.approved_terms ?? [])
        .filter((t) => t?.available)
        .map((t) => ({
          label: `${t.term} ${t.term > 1 ? 'months' : 'month'}`,
          value: String(t.term),
        })),
    [order.approved_terms]
  );

  const label = useMemo(() => {
    const n = Number(value);
    return n ? `${n} ${n === 1 ? 'month' : 'months'}` : '—';
  }, [value]);

  const handleChange = async (newValue: string) => {
    if (openModalForLoan) {
      openModalForLoan({ ...order, newTerm: newValue });
    }
  };

  React.useEffect(() => {
    if (
      order?.product?.installments &&
      String(order.product.installments) !== value
    ) {
      setValue(String(order.product.installments));
    }
  }, [order?.product?.installments]);

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
