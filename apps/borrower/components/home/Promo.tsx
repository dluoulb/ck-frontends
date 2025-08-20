import PrimaryButton from '@components/buttons/PrimaryButton';
import { useEntity } from '@contexts/EntityContext';
import { usePromo } from '@contexts/PromoContext';
import useModal from '@hooks/useModal';
import { formatCurrency } from '@lib/utils/formatters';
import { VCModalWrapper } from './widgets/virtual_cards/vc_modal';

export default function Promo() {
  const { entity } = useEntity();
  const { promoId, getPromoFromMerchant } = usePromo();
  const { isModalActive, toggleModal } = useModal();

  const promo = getPromoFromMerchant(entity?.promo_id || promoId);
  const activeBanner = entity?.cta_banners?.find((b) => b.enabled);
  console.log(promo)

  if (!promo || !activeBanner) return <></>;

  if (activeBanner && !['virtual_card', 'multi_use_virtual_card'].includes(activeBanner.name))
    return (
      <div className="rounded-lg border border-warning bg-primary-beige/20 my-4 p-4 text-center">
        <p>
          <strong>Limited Time Only!</strong> Pay zero interest for{' '}
          {promo.max_net_duration} days on all Credit Key orders
        </p>
      </div>
    );

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-center rounded-lg border border-warning bg-primary-beige/20 my-4 py-2 px-8 text-center">
        <p>
          <strong>Limited Time Offer!</strong> Pay zero interest for{' '}
          {promo.max_net_duration} days on Credit Key Card orders
          {promo.min_order_amount > 0 && (
            <span> over {formatCurrency(promo.min_order_amount)}</span>
          )}
        </p>
        {activeBanner.name === 'virtual_card' && <PrimaryButton
          ariaLabel="create-vc-card-with-promo-button"
          buttonText="Unlock Offer"
          buttonColor="bg-warning !font-normal py-2 sm:py-3 px-4 !md:px-8 xs:!my-2 md:!py-2.5"
          hoverClass="hover:bg-warning/80"
          containerClass="max-w-max"
          onClick={toggleModal}
        />}
      </div>
      <VCModalWrapper isModalActive={isModalActive} toggleModal={toggleModal} />
    </>
  );
}
