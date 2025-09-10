import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Script from 'next/script';

import useCompanyVirtualCard from '@apps/borrower/hooks/useCompanyVirtualCard';
import Loading from '@components/Loading';
import { qoloWidgetOrigin } from '@lib/constants/SiteVariables';
import vcSvg from '@lib/images/vc.svg';
import { VirtualCardAssets } from './virtualCardAssets';

declare const window: any;

interface ActiveVirtualCardProps {
  cardNumber?: string;
}

export default function ActiveVirtualCard({
  cardNumber,
}: ActiveVirtualCardProps) {
  const { virtualCard, refetchVirtualCard, virtualCardRefetching } =
    useCompanyVirtualCard();
  const [showWidget, setShowWidget] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const qoloWidgetUrl = `${qoloWidgetOrigin()}/widgets/js/qolo.initialize.v3.js`;

  const widget = {
    frame: {
      container_id: 'widget_container',
      iframe_class:
        'fs-exclude widget-iframe aspect-[385/244] w-full mx-auto overflow-y-scroll border-0',
      spinner: false,
      display: 'flex',
      filter:
        'invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%)',
      version: 'v3',
    },
    target_origin: qoloWidgetOrigin(),
    config: {
      token: virtualCard?.pci_token,
      copy_to_clipboard: true,
      main: 'show_pan',
      timeout: 90,
      auto_submit: true,
      css: {
        html: { overflow: 'hidden' },
        container: {
          border: 0,
          padding: 0,
          position: 'relative',
        },
        'div#show_pan .row:has(div):has(h1):has(span#show_pan_head)': {
          display: 'none',
        },
        'div#submit .row:has(div):has(span#status)': {
          display: 'none',
        },
        vc_bg: {
          background: `url("${VirtualCardAssets.BACKGROUND_BASE_64}")`,
          'background-size': 'cover',
        },
        vc_number: {
          color: '#fff',
          top: '44vw',
          'font-size': '4vw',
          'margin-left': '1.5rem',
          'letter-spacing': '0.05em',
        },
        card_exp_date: {
          color: '#fff',
          top: '10%',
          'font-size': '4vw',
          'margin-left': '1.5rem',
          'letter-spacing': '0.05em',
        },
        card_cvv: {
          color: '#fff',
          top: '10%',
          'font-size': '4vw',
          left: '12vw',
        },
        copy_clipboard: {
          background: 'none',
          border: 'none',
          position: 'absolute',
          padding: 0,
          top: '45vw',
          left: '58vw',
          'background-image': `url("${VirtualCardAssets.COPY_ICON_SVG}")`,
          'background-repeat': 'no-repeat',
          'background-position': 'center',
          'background-size': 'contain',
          width: '4vw',
          height: '4vw',
          display: 'block',
        },
        copy_clipboard_success: {
          display: 'block',
        },
      },
      content: {
        copy_clipboard_text: '',
      },
      remove: {
        copy_clipboard: 'w-100',
        row: 'my-4',
        'col-4': 'col-4',
        container: 'm-4',
        vc_number: 'ml-5',
        card_exp_date: 'ml-5',
        card_cvv: 'ml-5',
      },
      add: {
        row: 'my-2',
      },
    },
  };

  useEffect(() => {
    if (window.pciWidget) {
      setScriptLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (virtualCard?.pci_token && showWidget && scriptLoaded) {
      widget.config.token = virtualCard.pci_token;
      window.pciWidget(widget);
    }
  }, [virtualCard, showWidget, scriptLoaded]);

  const handleViewCardInfo = () => {
    refetchVirtualCard();
    if (showWidget) {
      setShowWidget(false);
    } else {
      setShowWidget(true);
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <Script
        src={qoloWidgetUrl}
        onLoad={() => {
          console.log('Script loaded successfully');
          setScriptLoaded(true);
        }}
        onError={(e) => {
          console.error('Script failed to load:', e);
        }}
      />

      {showWidget ? (
        <div className="relative">
          <div
            id="widget_container"
            className="aspect-[385/244] relative overflow-hidden rounded-xl"
          >
            {virtualCardRefetching && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-20">
                <Loading className="w-14 h-14 !text-primary" />
              </div>
            )}

            {!virtualCard?.pci_token && !virtualCardRefetching && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-20">
                <div className="text-center text-gray-500">
                  No card data available
                </div>
              </div>
            )}
          </div>

          <div className="absolute bottom-6 right-6 flex justify-center z-30">
            <button
              onClick={handleViewCardInfo}
              className="bg-white hover:bg-white/90 text-primary-blue px-3 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg"
            >
              Hide
            </button>
          </div>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden flex flex-col aspect-[385/244]">
          <Image
            src={vcSvg}
            alt="Credit Key Virtual Card"
            className="absolute inset-0 w-full h-full object-contain"
            fill
          />

          <div className="absolute inset-0 p-6 text-white flex flex-col justify-end z-10">
            {cardNumber && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-200">
                    Card Number
                  </span>
                </div>
                <div className="text-sm sm:text-xl tracking-wider">
                  {cardNumber}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <button
                onClick={handleViewCardInfo}
                className="px-3 py-2 rounded-lg text-sm font-bold transition-colors bg-white hover:bg-white/90 text-primary-blue"
              >
                View Card Info
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
