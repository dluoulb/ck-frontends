import React from 'react';
// import CTAButton from '../../shared/CTAButton';

export default function ConfirmVCModal({ modalState, prev }) {
  return (
    <div role={ConfirmVCModal.role}>
      <section>
        <div className="text-center">
          <p className="text-2xl my-2 font-avenir-black text-primary-blue">
            Credit Key Virtual Card
          </p>
          <p className="text-center mb-0 px-10">
            One moment while we redirect you to complete the virtual card
            process...
          </p>
        </div>
        {/* <div className="content flex flex-col items-center my-8">
          <CTAButton
            ariaLabel="back"
            buttonClass='px-16 bg-primary-blue text-white'
            buttonText="Create Another Card"
            icon="arrow-left"
            onClick={prev}
          />
        </div> */}
      </section>
      <footer className="mb-6">
        <p className="text-center">
          Didn't see a new window or tab open?
          <a
            href={modalState.data.checkout_url}
            target="_blank"
            rel="noreferrer"
            className="text-primary-blue hover:text-navy-blue ml-1 pt-1 no-underline font-avenir-medium"
          >
            Click here
          </a>
        </p>
      </footer>
    </div>
  );
}

ConfirmVCModal.role = 'confirm-vc-modal-component';
