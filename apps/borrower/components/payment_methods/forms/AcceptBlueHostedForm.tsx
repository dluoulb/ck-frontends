import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Loading from '@components/Loading';

const commonStyles = `
      border-color: #E5E7EB !important;
      border-radius: 6px;
      border: 1px solid transparent;
      color: #15191F !important;
      font-family: Manrope, sans-serif !important;
      font-size: 1rem;
      height: 1.5em;
      line-height: 1.5;
      padding-bottom: 0.5rem;
      padding-left: 1rem;
      padding-right: 1rem;
      padding-top: 0.5rem;
    `;
const styles = {
  container: 'height: 100%; width: 90%; margin: 0 !important',
  card: commonStyles + 'width: 83%; margin-bottom: 10px;',
  expiryMonth: commonStyles + 'width: 8.5%;',
  expiryYear: commonStyles + 'width: 8.5%;',
  cvv2: commonStyles + 'width: 18%;',
  avsZip: commonStyles + 'width: 18%;',
};

async function appendScript(src) {
  if (window.HostedTokenization) {
    return console.warn(
      'HostedTokenization is already defined. Skipping script load.'
    );
  }
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  document.body.appendChild(script);
}

export default function AcceptBlueHostedForm({
  setFormInteractedWith,
  setCardForm,
  cardForm,
  setCardErrors,
}) {
  const router = useRouter();
  const [waitTick, setWaitTick] = useState(0);
  const [startTime, setStartTime] = useState(new Date().getTime());
  const token = process.env.NEXT_PUBLIC_ACCEPT_BLUE_TOKEN;
  const src = process.env.NEXT_PUBLIC_ACCEPT_BLUE_SOURCE;

  const acceptBlueEvent = (event) => {
    setCardErrors([]);
    if (event.error) setCardErrors([event.error]);
    setFormInteractedWith(true);
  };

  const setup = async () => {
    await appendScript(src);
    setWaitTick(1);
  };

  const createForm = async () => {
    if (!window.HostedTokenization) {
      const now = new Date().getTime();

      if (now - startTime > 5000) {
        return router.push('/support');
      }

      setTimeout(() => setWaitTick(waitTick + 1), 500);
      return;
    }

    if (window.HostedTokenization && !cardForm) {
      const hostedTokenization = new window.HostedTokenization(token);
      const form = hostedTokenization.create('card-form');

      const existingForm = document.getElementById('tokenization-iframe');

      if (existingForm) {
        setCardForm(existingForm);
      } else {
        setCardForm(form);

        form
          .mount('#accept-blue', {
            fields: {
              zip: true,
              requireCvv2: true,
            },
          })
          .on('change', acceptBlueEvent);

        form.setStyles(styles);
      }
    }
  };

  useEffect(() => {
    setup();
  }, []);

  useEffect(() => {
    createForm();
  }, [waitTick]);

  return (
    <div role={AcceptBlueHostedForm.role}>
      {!cardForm && <Loading className="w-10 h-10 my-2" />}
      <div id="accept-blue" className="min-w-accept-blue h-32" />
    </div>
  );
}

AcceptBlueHostedForm.role = 'accept-blue-hosted-form-component';
