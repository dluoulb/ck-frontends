import useCompanyVirtualCard from '@apps/borrower/hooks/useCompanyVirtualCard';
import Loading from '@components/Loading';
import React, { useEffect, useState } from 'react';
import AddToDigitalWalletInstructions from '../AddToDigitalWalletInstructions';

declare const window: any;

export default function MultiUseVirtualCardDetails() {
  const { virtualCard } = useCompanyVirtualCard();
  const [status, setStatus] = useState('');

  const widget = {
    onSuccess: () => {
      setStatus('Card details will be masked after 90 seconds for security');
    },
    onFailure: () => {
      setStatus('Failed to retrieve card details');
    },
    frame: {
      container_id: 'widget_container',
      iframe_class: 'widget-iframe min-h-[270px] w-full mx-auto',
      //loading spinner
      // src: 'https://raw.githubusercontent.com/n3r4zzurr0/svg-spinners/main/preview/eclipse-black-36.svg',
      spinner: true,
      display: 'flex',
      filter: 'invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%)',
      version: 'v3',
    },
    target_origin: 'https://devapi.qolopay.com',
    config: {
      token: virtualCard?.pci_token,
      copy_to_clipboard: true,
      main: 'show_pan',
      timeout: 90,
      auto_submit: true,
      css: {
        container: {
          border: 0,
        },
        'div#show_pan .row:has(div):has(h1):has(span#show_pan_head)': {
          display: 'none',
        },
        'div#submit .row:has(div):has(span#status)': {
          display: 'none',
        },
        vc_network: {
          right: 0,
          bottom: 0,
          width: '30%',
        },
        vc_bg: {
          background: "linear-gradient(45deg,silver,white,silver)"
        },
        vc_logo: {
          content: 'url(https://cdn.prod.website-files.com/621b04511126b6ed38ef9486/62b1f3ac4dd2d864b488b0ea_Creditkey-logo-2022.svg)',
          width: '40%',
          right: 20,
          top: 20,
        },
        vc_name: {
          left: 25,
          top: 100,
          display: 'inline',
        },
        vc_number: {
          color: '#333',
          'font-size': '5.8vw',
        },
        card_exp_date: {
          color: '#333',
          'font-size': '3.5vw',
        },
        card_cvv: {
          color: '#333',
          'font-size': '3.5vw',
        },
        copy_clipboard_success: {
          display: 'block',
        },
      },
      content: {
        copy_clipboard_text: 'Copy Card # to Clipboard',
      },
      remove: {
        copy_clipboard: 'w-100',
        row: 'my-4',
        'col-4': 'col-4',
      },
      add: {
        row: 'my-2',
      },
    },
  };

  useEffect(() => {
    if (virtualCard?.pci_token) {
      widget.config.token = virtualCard.pci_token;
      window.pciWidget(widget);
    }
  }, [virtualCard]);

  return (
    <>
      <div
        className="md:col-span-2 md:row-span-2 rounded-lg border border-black border-opacity-5 p-4 md:p-8"
        id='widget_container'
      >
        <p>{status}</p>
        {!virtualCard?.pci_token && <Loading className="w-14 h-14 my-20 !text-primary" />}
      </div>
      {virtualCard?.pci_token && (
        <div className="mt-4">
          <AddToDigitalWalletInstructions />
        </div>
      )}
    </>
  );
};

