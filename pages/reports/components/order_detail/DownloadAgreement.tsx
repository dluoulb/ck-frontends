import React, { useState } from 'react';
import Loading from '@components/Loading';
import { faDownload } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import { useSession } from 'next-auth/react';

import useToast from '../../../../hooks/useToast';
import { getAgreement } from '../../../../lib/actions/orders';

export default function DownloadAgreement({
  order,
  buttonText = '',
  buttonClass = '',
}) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const { makeToast } = useToast();

  const fetchAgreement = (order) => {
    let download;
    download = getAgreement(order, session?.access_token);

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
    >
      <p>{buttonText}</p>
      {loading ? (
        <Loading className="w-3 h-3" />
      ) : (
        <span className="flex items-center gap-2">
          <FontAwesomeIcon icon={faDownload} />
          <p className="hidden mid:inline">Download</p>
        </span>
      )}
    </div>
  );
}
