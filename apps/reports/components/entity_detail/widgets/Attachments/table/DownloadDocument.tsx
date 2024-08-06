import React, { useState } from 'react';
import { faDownload } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';

import Loading from '@components/Loading';
import useToast from '@hooks/useToast';
import { getEntityDocument } from '@lib/actions/entities';

export default function DownloadDocument({ document_id }) {
  const queryClient = useQueryClient();
  const { id, type } = useRouter().query;
  const { makeToast } = useToast();
  const [loading, setLoading] = useState(false);
  const entity = queryClient.getQueryData([type, id]);

  const fetchDocument = async () => {
    let download;
    download = await getEntityDocument(entity, document_id);

    setLoading(true);
    download
      .start()
      .then(() => {
        setLoading(false);
      })
      .catch(function (error) {
        let msg = '';
        if (error.request.status === 404) {
          msg = 'Document not found, please contact support.';
        } else {
          msg = 'Document unavailable, please contact support.';
        }

        makeToast(msg, 'error');
        setLoading(false);
      });
  };

  return (
    <span
      className="cursor-pointer hover:text-primary-blue-hover"
      onClick={fetchDocument}
    >
      {loading ? (
        <Loading className="w-3 h-3" containerClass="!justify-start" />
      ) : (
        <FontAwesomeIcon
          icon={faDownload}
          className="text-primary-blue hover:text-primary-blue-hover"
        />
      )}
    </span>
  );
}
