import { faChevronRight } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classNames from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';

const PageNavigation = ({ entity, order }) => {
  const pathname = usePathname();
  const { content } = useRouter().query;

  const buildLinkPath = () => {
    if (entity?.type === 'account') {
      return `/reports/accounts/${entity?.id}`;
    }
    return `/reports/companies/${entity?.id}`;
  };

  return (
    <div className="flex items-center my-4 md:my-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-primary font-semibold">
        <div className="flex items-center gap-2">
          <Link href="/reports" className="hover:text-primary-blue-hover">
            Search
          </Link>
          <FontAwesomeIcon icon={faChevronRight} className="text-xs mt-0.5" />
        </div>
        {entity && (
          <>
            <div className="flex items-center gap-2">
              <Link
                href={`${buildLinkPath()}?content=dashboard`}
                className="hover:text-primary-blue-hover"
              >
                {entity?.name}
              </Link>
              <FontAwesomeIcon
                icon={faChevronRight}
                className={classNames(
                  'text-xs mt-0.5',
                  pathname.includes('companies') ? 'hidden' : 'sm:hidden'
                )}
              />
            </div>
            {content === 'orders' && (
              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="hidden sm:inline text-xs mt-0.5"
                />
                <Link
                  href={`${buildLinkPath()}?content=orders`}
                  className="hover:text-primary-blue-hover"
                >
                  Orders
                </Link>
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className={classNames(
                    'text-xs mt-0.5',
                    pathname.includes('companies') ? 'hidden' : 'sm:hidden'
                  )}
                />
              </div>
            )}
          </>
        )}
        {order && (
          <>
            <FontAwesomeIcon
              icon={faChevronRight}
              className="hidden sm:inline text-xs mt-0.5"
            />
            <p className="text-primary-blue-hover">
              {order?.product?.order_key}
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default PageNavigation;
