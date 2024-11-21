import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/pro-regular-svg-icons';
import useModal from '@hooks/useModal';
import MultiUseVirtualCardDetailsModal from './vc_modal/MultiUseVirtualCardDetailsModal';
import Loading from '@components/Loading';
import { reformatDate, sortDateTimes } from '@lib/utils/datetime_formatters';
import classNames from 'classnames';

export default function ActiveMultiUseVirtualCard({ virtualCards }) {
  const { isModalActive, toggleModal } = useModal();
  const [clipped, setClipped] = useState(false);

  const sortedCards = virtualCards?.sort((a, b) =>
    sortDateTimes(b.created_at, a.created_at)
  );

  const cardNumberDisplay = (vc) => {
    if (clipped) {
      return `x${vc.last_four}`;
    }

    return (
      <>
        ••••{'  '}
        ••••{'  '}
        ••••{'  '}
        {vc.last_four}
      </>
    );
  };

  const columnHeaders = [
    { name: 'Date', className: 'hidden md:block lg:hidden 3xl:block' },
    { name: 'Card Number', className: null },
  ];

  window.addEventListener('resize', () => {
    if (
      (window.innerWidth >= 1024 && window.innerWidth <= 1167) ||
      window.innerWidth < 415
    ) {
      setClipped(true);
    } else {
      setClipped(false);
    }
  });

  if (!virtualCards) return <Loading />;

  return (
    <div
      className="h-48 w-full border-b border-secondary-gray overflow-y-scroll"
      role={ActiveMultiUseVirtualCard.role}
    >
      <div className="w-full divide-y">
        <table className="w-full divide-y divide-gray-300">
          <thead>
            <tr>
              {columnHeaders.map((header, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className={classNames(
                    'py-2 text-left text-sm font-bold',
                    header.className
                  )}
                >
                  {header.name}
                </th>
              ))}
              <th scope="col" className="relative py-2">
                <span className="sr-only">Reveal</span>
              </th>
            </tr>
          </thead>
          <tbody className="overflow-y-scroll divide-y">
            {sortedCards?.map((vc, idx) => (
              <tr key={idx}>
                <td className="py-2 text-sm min-w-min hidden md:inline">
                  <span className="block">{reformatDate(vc?.created_at)}</span>
                </td>
                <td
                  className={classNames(
                    'whitespace-nowrap py-2 text-sm items-center',
                  )}
                >
                  {cardNumberDisplay(vc)}
                </td>
                <td className="relative whitespace-nowrap py-2 text-right text-sm font-medium">
                  <button
                    type="button"
                    className="flex tracking-wider hover:text-primary-blue-hover text-sm"
                    onClick={toggleModal}
                  >
                    <FontAwesomeIcon icon={faEye} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <MultiUseVirtualCardDetailsModal isModalActive={isModalActive} toggleModal={toggleModal} />
    </div>
  );
}

ActiveMultiUseVirtualCard.role = 'active-multi-use-virtual-card-component';
