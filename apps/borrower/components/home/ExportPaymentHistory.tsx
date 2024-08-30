import React, { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import Datepicker from 'react-tailwindcss-datepicker';

import PrimaryButton from '@components/buttons/PrimaryButton';
import useApi from '@hooks/useApi';
import useToast from '@hooks/useToast';
import useUser from '@hooks/useUser';
import { exportPaymentHistory } from '@lib/actions/payments';

export default function ExportPaymentHistory() {
  const api = useApi();
  const { makeToast } = useToast();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const format = (d) => DateTime.fromJSDate(d).toFormat('yyyy-M-d');

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
      })
      .catch((err) => {
        makeToast(
          'An error occurred. Please try again or contact our support team.',
          'error'
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between px-2 py-2 md:py-0">
      <p className="text-lg md:text-xl font-bold mx-0.5 md:mx-0">
        Export Payment History
      </p>
      <div className="flex flex-col xs:flex-row md:items-center gap-0 xs:gap-2 md:gap-2 text-sm md:text-base">
        <Datepicker
          popoverDirection="up"
          displayFormat="MM/DD/YYYY"
          separator="to"
          placeholder="Select Date Range"
          onChange={(newValue) => setDateRange(newValue)}
          containerClassName="relative my-2 max-w-max md:min-w-56 md:max-w-60 border border-primary-border-gray rounded-md"
          inputClassName="pl-3 pr-4 py-2 max-w-max md:min-w-56 md:max-w-60 focus-visible:outline-none border border-primary-border-gray rounded-md"
          showShortcuts={true}
          useRange={false}
          value={dateRange}
        />
        <PrimaryButton
          ariaLabel="export-payment-history"
          buttonText="Export"
          buttonColor=" bg-primary-blue-hover !font-normal !md:px-8 xs:!my-2 md:!py-2.5"
          hoverClass="hover:bg-primary-blue-hover/80"
          containerClass="2xs:max-w-max md:max-w-auto"
          onClick={handleSubmit}
          disabled={!dateRange?.startDate || !dateRange?.endDate || loading}
          isLoading={loading}
        />
      </div>
    </div>
  );
}
