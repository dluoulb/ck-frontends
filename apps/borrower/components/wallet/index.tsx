import useCompanyVirtualCard from '@apps/borrower/hooks/useCompanyVirtualCard';
import Loading from '@components/Loading';
import ActiveCardSection from './ActiveCardSection';
import InactiveCardSection from './InactiveCardSection';
import PendingTransactionsSection from './PendingTransactionsSection';

export default function Wallet() {
  const vcProps = useCompanyVirtualCard();

  if (!vcProps) {
    return (
      <div className="h-full flex justify-center items-center">
        <Loading />
      </div>
    );
  }
  return (
    <div
      data-testid="wallet-container"
      className="my-4 md:my-6 mx-auto h-full xl:max-w-[90%]"
      role={Wallet.role}
    >
      <div className="h-full">
        <h1 className="text-2xl md:text-3xl font-bold text-primary capitalize mb-8">
          Wallet
        </h1>

        <div className="space-y-8">
          {vcProps.virtualCardLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loading />
            </div>
          ) : (
            <>
              {vcProps.virtualCard &&
                vcProps.virtualCard.status === 'ACTIVE' && (
                  <ActiveCardSection virtualCard={vcProps.virtualCard} />
                )}

              {(!vcProps.virtualCard ||
                vcProps.virtualCard.status !== 'ACTIVE') && (
                <InactiveCardSection />
              )}

              {!vcProps.virtualCard && vcProps.virtualCardError && (
                <div className="text-center py-8 text-error">
                  An error occurred loading your cards. Please contact support.
                </div>
              )}

              <PendingTransactionsSection />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

Wallet.role = 'wallet-page';
