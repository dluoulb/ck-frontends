import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import Datepicker from 'react-tailwindcss-datepicker';

import PrimaryButton from '@components/buttons/PrimaryButton';
import { useUser } from '@contexts/UserContext';
import useApi from '@hooks/useApi';
import useToast from '@hooks/useToast';
import { exportPaymentHistory } from '@lib/actions/payments';

export default function ExportPaymentHistory() {
  const api = useApi();
  const { makeToast } = useToast();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const format = (d) => (d ? DateTime.fromJSDate(d).toFormat('yyyy-M-d') : '');

  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    // Adjust width of nested divs within Datepicker
    const icon = document.querySelector('.h-5');
    const calendar = document.querySelector('.z-10.hidden');

    if (calendar) {
      calendar.classList.add('min-w-[70vw]', 'md:min-w-fit');
    }
    if (icon) {
      icon.classList.add('!h-4', '!w-4', 'md:h-5', 'md:w-5');
    }
  }, [document]);

  const handleSubmit = () => {
    setLoading(true);
    exportPaymentHistory({
      api,
      userId: user?.id,
      startDate: format(dateRange?.startDate),
      endDate: format(dateRange?.endDate),
    })
      .then((res) => {
        makeToast(res?.data?.message, 'success');
        setDateRange({
          startDate: null,
          endDate: null,
        });
      })
      .catch((err) => {
        makeToast('An error occurred. Please try again or contact our support team.', 'error');
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <p className="text-xl font-medium">Export Payment History</p>
      <div className="flex md:items-center gap-2 xs:gap-2 md:gap-2 text-sm">
        <Datepicker
          popoverDirection="up"
          displayFormat="MM/DD/YYYY"
          separator="to"
          placeholder="Select Date Range"
          onChange={(newValue) => setDateRange(newValue)}
          containerClassName="relative my-2 max-w-max md:min-w-56 md:max-w-60"
          inputClassName="pl-3 pr-4 py-1.5 max-w-max md:min-w-56 md:max-w-60 focus-visible:outline-none border border-primary-gray-border rounded-md"
          showShortcuts={true}
          useRange={false}
          value={dateRange}
        />
        <PrimaryButton
          ariaLabel="export-payment-history"
          buttonText="Export"
          buttonColor="bg-white !text-primary !font-medium border border-border-grey !py-1.5 !rounded-md"
          hoverClass="hover:bg-gray-100"
          onClick={handleSubmit}
          disabled={!dateRange?.startDate || !dateRange?.endDate || loading}
          isLoading={loading}
        />
      </div>
    </div>
  );
}
