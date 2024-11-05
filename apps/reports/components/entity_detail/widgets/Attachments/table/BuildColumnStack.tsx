import { reformatDate } from '@lib/utils/datetime_formatters';
import DownloadDocument from './DownloadDocument';

export const BuildStack = ({ original }) => {
  return (
    <>
      <p className="font-semibold lg:font-normal flex gap-1">
        <span className="lg:hidden font-normal">File Name:</span>
        <div className="truncate">{original?.file_name}</div>
      </p>
      <p className="block mid:hidden font-semibold flex gap-1">
        <span className="font-normal">Created at:</span>
        <span>{reformatDate(original.created_at)}</span>
      </p>
      <div className="block md:hidden font-semibold">
        <span className="mr-1 font-normal">Type:</span>
        <span className="capitalize">
          {original.file_type === 'misc'
            ? 'Miscellaneous'
            : original.file_type?.replace(/_/g, ' ')}
        </span>
      </div>
      <p className="block lg:hidden font-semibold text-primary-blue">
        <span className="mr-1 font-normal">Download:</span>
        <DownloadDocument document_id={original?.id} />
      </p>
    </>
  );
};
