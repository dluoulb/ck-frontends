import React, { useState } from 'react';
import { faDownload } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import Loading from '@components/Loading';
import useToast from 'hooks/useToast';
import { getCompanyDocument } from 'lib/actions/companies';

export default function DownloadDocument({ document_id }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id } = router.query;
  const { makeToast } = useToast();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const company = queryClient.getQueryData(['company', id]);

  const fetchDocument = () => {
    let download;
    download = getCompanyDocument(company, document_id, session?.access_token);

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
