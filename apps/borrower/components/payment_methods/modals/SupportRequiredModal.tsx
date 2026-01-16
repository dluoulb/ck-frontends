import PrimaryButton from '@components/buttons/PrimaryButton';
import Support from '@components/Support';

export default function SupportRequiredModal({ toggleModal }) {
  return (
    <div>
      <div className="text-center">
        <div className="my-4 sm:my-2">
          <p className="text-xl sm:text-2xl font-bold">New Payment Method</p>
          <div className="my-1 sm:my-2">
            <Support
              showTagLine={false}
              message="Please contact support to change your payment method details."
              containerClass="border-0"
            />
            <PrimaryButton
              ariaLabel="close_modal_button"
              buttonText="Close"
              buttonColor="bg-primary-blue"
              hoverClass="hover:bg-primary-blue-hover"
              containerClass="flex-shrink-0 whitespace-nowrap"
              onClick={toggleModal}
            />
          </div>
        </div>
      </div>
      <div className="layer" />
    </div>
  );
}
