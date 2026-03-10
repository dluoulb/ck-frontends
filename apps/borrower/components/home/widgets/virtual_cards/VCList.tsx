import React, { useEffect, useState } from 'react';
import { faClipboard, faEye } from '@fortawesome/pro-regular-svg-icons';
import { faLockKeyhole } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import Loading from '@components/Loading';
import useToast from '@hooks/useToast';
import { reformatDate, sortDateTimes } from '@lib/utils/datetime_formatters';

export default function VCList({ vc_orders }) {
  const { makeToast } = useToast();
  const [hide, setHide] = useState([]);
  const [clipped, setClipped] = useState(false);

  const sortedCards = vc_orders?.sort((a, b) => sortDateTimes(b.created_at, a.created_at));

  const cardNumberDisplay = (vc, idx) => {
    if (clipped) return `x${vc?.virtual_card_details?.number.slice(-4)}`;

    if (!hide[idx]) {
      return (
        <>
          {vc?.virtual_card_details?.number.substring(0, 4)}
          {'  '}
          {vc?.virtual_card_details?.number.substring(4, 8)}
          {'  '}
          {vc?.virtual_card_details?.number.substring(8, 12)}
          {'  '}
          {vc?.virtual_card_details?.number.substring(12, 16)}
        </>
      );
    } else {
      return (
        <>
          ••••{'  '}
          ••••{'  '}
          ••••{'  '}
          {vc?.virtual_card_details?.number.substring(12, 16)}
        </>
      );
    }
  };

  const columnHeaders = [
    { name: 'Merchant', className: null },
    { name: 'Card Number', className: 'hidden sm:block md:hidden lg:block' },
    { name: 'CVC', className: null },
  ];

  window.addEventListener('resize', () => {
    if ((window.innerWidth >= 1024 && window.innerWidth <= 1167) || window.innerWidth < 415) {
      setClipped(true);
    } else {
      setClipped(false);
    }
  });

  useEffect(() => {
    setHide(new Array(sortedCards?.length).fill(true));
  }, [vc_orders]);

  if (!vc_orders) <Loading />;

  return (
    <div
      className="h-48 w-full border-b border-secondary-gray overflow-y-scroll"
      role={VCList.role}
    >
      <div className="w-full divide-y divide-gray-200">
        <table className="w-full divide-y divide-gray-300">
          <thead>
            <tr>
              {columnHeaders.map((header, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className={classNames('py-2 text-left text-sm font-bold', header.className)}
                >
                  {header.name}
                </th>
              ))}
              <th scope="col" className="relative py-2">
                <span className="sr-only">Reveal</span>
              </th>
            </tr>
          </thead>
          <tbody className="overflow-y-scroll divide-y divide-gray-200">
            {sortedCards?.map((vc, idx) => (
              <tr key={idx}>
                <td className="truncate py-2 text-sm min-w-min">
                  <span title={vc?.merchant?.name} className="font-semibold">
                    {vc?.merchant?.name}
                  </span>
                  <span className="block">{reformatDate(vc?.created_at)}</span>
                  <span className="block">Exp: {vc?.virtual_card_details.expiration}</span>
                  <span className="flex sm:hidden md:flex lg:hidden font-semibold items-center gap-1.5">
                    {cardNumberDisplay(vc, idx)}
                    <FontAwesomeIcon
                      icon={faClipboard}
                      className="text-sm xl:text-lg text-gray-600 hover:text-gray-900 cursor-pointer mt-0.5"
                      onClick={() => {
                        navigator.clipboard.writeText(vc?.virtual_card_details?.number);
                        makeToast('Card Number Copied!', 'success');
                      }}
                    />
                  </span>
                </td>
                <td
                  className={classNames(
                    'hidden sm:flex md:hidden lg:flex whitespace-nowrap pt-6 pb-4 text-sm items-center gap-1.5',
                    {
                      'tracking-wide': hide[idx],
                    },
                  )}
                >
                  {cardNumberDisplay(vc, idx)}
                  <FontAwesomeIcon
                    icon={faClipboard}
                    className="text-lg text-gray-600 hover:text-gray-900 cursor-pointer mt-0.5"
                    onClick={() => {
                      navigator.clipboard.writeText(vc?.virtual_card_details?.number);
                      makeToast('Card Number Copied!', 'success');
                    }}
                  />
                </td>
                <td className="whitespace-nowrap py-4 text-sm">
                  <span
                    className={classNames(
                      'py-1 rounded-full',
                      hide[idx]
                        ? 'px-4 bg-success/20 text-transparent'
                        : 'bg-transparent text-primary',
                    )}
                  >
                    {vc?.virtual_card_details?.cvc}
                  </span>
                </td>
                <td className="relative whitespace-nowrap py-4 text-right text-sm font-medium">
                  <button
                    type="button"
                    className="flex tracking-wider hover:text-primary-blue-hover text-sm"
                    onClick={() =>
                      setHide(
                        hide.map((item, index) => {
                          if (index === idx) return (hide[index] = !item);
                          return item;
                        }),
                      )
                    }
                  >
                    {hide[idx] ? (
                      <FontAwesomeIcon icon={faEye} />
                    ) : (
                      <FontAwesomeIcon icon={faLockKeyhole} className="text-primary-blue" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

VCList.role = 'virtual-card-list-component';
