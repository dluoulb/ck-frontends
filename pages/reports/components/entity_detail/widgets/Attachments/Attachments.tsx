import React from 'react';
import Loading from '@components/Loading';
import { faDownload } from '@fortawesome/pro-regular-svg-icons';
import { faSquare } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DocumentsTable from '@reports/entity_detail/widgets/Attachments/table/DocumentsTable';

export default function Attachments({ props }) {
  const {
    documents,
    errors: { documentError },
  } = props;

  if (documentError)
    return (
      <p className="text-error">
        An Error Occured. Please contact Credit Key support.
      </p>
    );

  if (!documents && !documentError)
    return <Loading className="w-14 h-14 my-16" />;

  return (
    <div className="capitalize min-h-80">
      <div className="flex items-center gap-2 border-b border-primary-gray-border pb-2">
        <span className="fa-layers fa-fw text-4xl lg:text-5xl hidden sm:inline">
          <FontAwesomeIcon icon={faSquare} className="text-secondary-blue" />
          <FontAwesomeIcon
            icon={faDownload}
            className="text-primary-blue text-base lg:text-xl"
          />
        </span>

        <p className="font-bold tracking-wide text-primary-blue-hover px-2 md:px-0 md:text-lg lg:text-xl">
          Documents
        </p>
      </div>
      <DocumentsTable
        documents={documents?.map((d) => {
          return { ...d.attributes, id: d.id };
        })}
      />
    </div>
  );
}
