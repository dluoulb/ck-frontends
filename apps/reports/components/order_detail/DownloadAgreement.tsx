import React, { useState } from 'react';
import { faDownload } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import Loading from '@components/Loading';
import useToast from '@hooks/useToast';
import { getAgreement } from '@lib/actions/orders';

export default function DownloadAgreement({
  order,
  buttonText = '',
  buttonClass = '',
  isTable = false,
}) {
  const [loading, setLoading] = useState(false);
  const { makeToast } = useToast();

  const fetchAgreement = async (order) => {
    let download;
    download = await getAgreement(order);

    setLoading(true);
    download
      .start()
      .then(() => {
        setLoading(false);
      })
      .catch(function (error) {
        let msg = '';
        if (error.request.status === 404) {
          msg = 'Agreement not found, please contact support.';
        } else {
          msg = 'Agreement unavailable, please contact support.';
        }

        makeToast(msg, 'error');
        setLoading(false);
      });
  };

  return (
    <div
      onClick={() => fetchAgreement(order)}
      className={classNames('flex items-center gap-1.5', buttonClass)}
      role={DownloadAgreement.role}
    >
      <p>{buttonText}</p>
      {loading ? (
        <Loading className="w-3 h-3" />
      ) : (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faDownload} />
          <p className={classNames(isTable ? 'hidden mid:inline' : 'hidden')}>
            Download
          </p>
        </span>
      )}
    </div>
  );
}

DownloadAgreement.role = 'download-agreement-component'