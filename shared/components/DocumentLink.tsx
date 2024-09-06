import React, { useState } from 'react';
import { faDownload } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';

import Loading from '@components/Loading';
import useToast from '@hooks/useToast';
import { getAgreement, getInvoice } from '@lib/actions/orders';

export default function DocumentLink({
  type,
  order,
  buttonText,
  buttonClass = '',
  invoice_id = '',
  isTable = false,
}) {
  const [loading, setLoading] = useState(false);
  const { makeToast } = useToast();

  const downloadDocument = async () => {
    let download;

    switch (type) {
      case 'agreement':
        download = await getAgreement(order);
        break;
      case 'invoice_document':
        download = await getInvoice(order, invoice_id);
        break;
    }

    setLoading(true);
    download
      .start()
      .then(() => {
        setLoading(false);
      })
      .catch(function (error) {
        let msg;
        if (error.request.status === 404) {
          msg = (
            <span>
              <span className="capitalize">{type.replace('_', ' ')}</span> not
              found, please contact support.
            </span>
          );
        } else {
          msg = (
            <span>
              <span className="capitalize">{type.replace('_', ' ')}</span>{' '}
              unavailable, please contact support.
            </span>
          );
        }

        makeToast(msg, 'error');
        setLoading(false);
      });
  };

  return (
    <div
      onClick={downloadDocument}
      className={classNames('flex items-center gap-1.5 ', buttonClass)}
      role={DocumentLink.role}
    >
      <p>{buttonText}</p>
      {loading ? (
        <Loading className="w-3 h-3" />
      ) : (
        <FontAwesomeIcon icon={faDownload} />
      )}
    </div>
  );
}

DocumentLink.role = 'document-link-component';
