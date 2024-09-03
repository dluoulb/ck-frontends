import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const commonStyles = `
      border-color: #abb4be !important;
      border-radius: 6px;
      border: 1px solid transparent;
      color: #182b3e !important;
      color: #363636;
      font-family: "Manrope", sans-serif;
      font-size: 1rem;
      height: 2.5em;
      line-height: 1.5;
      padding-bottom: calc(0.5em - 1px);
      padding-left: calc(0.75em - 1px);
      padding-right: calc(0.75em - 1px);
      padding-top: calc(0.5em - 1px);
    `;
const styles = {
  container: 'height: 500px; width: 90%; margin: 0 auto',
  card: commonStyles + 'width: 94.5%; margin-bottom: 10px;',
  expiryMonth: commonStyles + 'width: 10%;',
  expiryYear: commonStyles + 'width: 10%;',
  cvv2: commonStyles + 'width: 18%;',
  avsZip: commonStyles + 'width: 31%;',
};

async function appendScript(src) {
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
  const token = process.env.REACT_APP_ACCEPT_BLUE_TOKEN;
  const polyfill = process.env.REACT_APP_ACCEPT_BLUE_POLYFILL_SOURCE;
  const src = process.env.REACT_APP_ACCEPT_BLUE_SOURCE;

  const acceptBlueEvent = (event) => {
    setCardErrors([]);
    if (event.error) setCardErrors([event.error]);
    setFormInteractedWith(true);
  };

  const setup = async () => {
    await appendScript(polyfill);
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
      const form = window.HostedTokenization(token).create('card-form');
      setCardForm(form);

      form.mount('#accept-blue').on('change', acceptBlueEvent);
      form.setStyles(styles);
    }
  };

  useEffect(() => {
    setup();
  }, []);

  useEffect(() => {
    createForm();
  }, [waitTick]);

  return <div>AcceptBlueHostedForm</div>;
}
