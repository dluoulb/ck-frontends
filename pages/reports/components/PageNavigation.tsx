import { faChevronRight } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const PageNavigation = ({ order, type, entity }) => {
  const pathname = usePathname();
  const buildLinkPath = () => {
    if (type === 'account') {
      return `/accounts/${entity?.id}`;
    }
    return `/companies/${entity?.id}`;
  };

  return (
    <div className="flex items-center my-4 md:my-6">
      <div className="flex flex-col sm:flex-row sm:items-center md:gap-2 text-primary font-semibold">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-primary-blue-hover">
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
            </div>
            {!pathname.includes('companies') && (
              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faChevronRight}
                  className="text-xs mt-0.5"
                />
                <Link
                  href={`${buildLinkPath()}?content=loans`}
                  className="hover:text-primary-blue-hover"
                >
                  Orders
                </Link>
              </div>
            )}
          </>
        )}
        {order && (
          <>
            <FontAwesomeIcon icon={faChevronRight} className="text-xs mt-0.5" />
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
