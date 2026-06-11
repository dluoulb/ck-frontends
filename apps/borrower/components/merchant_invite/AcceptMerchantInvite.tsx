import React, { useEffect, useState } from 'react';
import { faEnvelopeOpen } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { BaseGrid, BaseGridItem } from '@components/BaseGrid';
import Loading from '@components/Loading';
import useApi from '@hooks/useApi';
import { acceptMerchantInvite } from '@lib/actions/merchants';
import MerchantRecord from '@lib/records/merchant';

export default function AcceptMerchantInvite() {
  const [merchant, setMerchant] = useState<MerchantRecord>();
  const [loading, setLoading] = useState(true);
  const api = useApi();
  const router = useRouter();
  const { id: slug } = router.query;

  const panelBgColor = () => {
    if (merchant) return '!bg-background-success/60';
    return '!bg-white';
  };
  const gridConfig = () => {
    return `col-span-7 md:col-span-3 ${panelBgColor()} mx-2 md:mx-3 mb-2 md:mb-3 shadow-xl`;
  };

  useEffect(() => {
    acceptMerchantInvite(api, slug)
      .then((merchant) => setMerchant(merchant))
      .catch(() => console.log('failed to accept invite'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-3 p-2 h-full">
      <div data-testid="container" className="my-4 md:my-6 mx-auto h-full">
        <div className="mx-2 xl:max-w-[90%] xl:mx-auto h-full">
          <div className="relative rounded-md border-t border-x border-border-gray shadow-sm mt-4 md:mt-8">
            <div className="relative my-4 md:my-6">
              <BaseGrid gridContainerClass="grid grid-cols-1 md:grid-cols-6 gap-y-1.5 md:gap-y-3">
                <BaseGridItem gridConfig={gridConfig()}>
                  {loading && <Loading />}
                  {!loading && merchant && (
                    <div className="px-3 p-2 h-full">
                      <div className="flex items-center gap-2.5 border-b border-primary-blue-hover/30 pb-3">
                        <FontAwesomeIcon
                          icon={faEnvelopeOpen}
                          className="text-primary-blue text-base lg:text-xl"
                        />
                        <p className="text-lg md:text-xl font-bold">Invitation Accepted!</p>
                      </div>
                      <div className="mt-4">
                        <p>You are now connected with {merchant.name}</p>
                        <p className="mt-3">
                          Visit{' '}
                          <a
                            className="text-primary-blue hover:text-primary-blue-hover"
                            href={merchant.url}
                          >
                            {merchant.url}
                          </a>{' '}
                          to place an order
                        </p>
                        <div className="mt-8">
                          <Link
                            className="text-primary-blue hover:text-primary-blue-hover"
                            href="/"
                          >
                            Go to dashboard
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                  {!loading && !merchant && (
                    <div className="px-3 p-2 h-full">
                      <div className="mt-4 text-red-700">
                        <p>
                          Something went wrong accepting the invite. Please contact our customer
                          support team.
                        </p>
                        <div className="mt-8">
                          <Link
                            className="text-primary-blue hover:text-primary-blue-hover"
                            href="/"
                          >
                            Go to dashboard
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </BaseGridItem>
              </BaseGrid>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
