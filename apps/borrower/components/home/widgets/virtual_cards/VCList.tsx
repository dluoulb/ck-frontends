import Loading from '@components/Loading';
import { reformatDate, sortDateTimes } from '@lib/utils/datetime_formatters';

export default function VCList({ vc_orders }) {
  if (!vc_orders) <Loading />;

  const sortedCards = vc_orders?.sort((a, b) =>
    sortDateTimes(b.created_at, a.created_at)
  );

  return (
    <div
      className="h-36 w-full border-y border-secondary-gray overflow-y-scroll"
      role={VCList.role}
    >
      <div className="min-w-full divide-y">
        {sortedCards?.map((vc) => (
          <div
            className="text-sm flex flex-col md:flex-row md:items-center justify-between py-1.5"
            key={vc.id}
          >
            <div>
              <p>
                Date: <strong>{reformatDate(vc?.created_at)}</strong>
              </p>
              <p>
                Merchant: <strong>{vc?.merchant?.name}</strong>
              </p>
            </div>
            <div>
              <p>
                Ends in:{' '}
                <strong>
                  x{vc?.virtual_card_details?.number?.substring(12, 16)}
                </strong>
              </p>
              <p>
                Exp: <strong>{vc?.virtual_card_details?.expiration}</strong>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

VCList.role = 'virtual-card-list-component';
