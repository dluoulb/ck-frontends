import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Script from 'next/script';

import { useEntity } from '@contexts/EntityContext';
import useApi from '@hooks/useApi';
import { getVirtualCardToken } from '@lib/actions/companies';
import { qoloWidgetOrigin } from '@lib/constants/SiteVariables';
import vcSvg from '@lib/images/vc.svg';
import CompanyVirtualCardRecord from '@lib/records/company_virtual_card';
import { formatCardNumber } from '../../../../../shared/lib/utils/formatters';
import { CardAssets } from '../cardAssets';

declare const window: any;

interface ActiveVirtualCardProps {
  card: CompanyVirtualCardRecord;
  showWidget: boolean;
  onShowWidget: () => void;
  onHideWidget: () => void;
}

export default function ActiveVirtualCard({
  card,
  showWidget,
  onShowWidget,
  onHideWidget,
}: ActiveVirtualCardProps) {
  const api = useApi();
  const [token, setToken] = useState();
  const { entity } = useEntity();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [nameCopied, setNameCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isAmazonExclusive = entity?.isAmazonExclusive ?? false;
  const owner = entity?.type === 'company' ? entity?.borrower : entity?.user;
  const ownerName = owner ? `${owner.first_name || ''} ${owner.last_name || ''}`.trim() : '';
  const showOwnerName = isAmazonExclusive && !!ownerName;

  const handleCopyName = useCallback(() => {
    if (!ownerName) return;
    navigator.clipboard
      .writeText(ownerName)
      .then(() => {
        setNameCopied(true);
        if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
        copyTimeoutRef.current = setTimeout(() => setNameCopied(false), 5000);
      })
      .catch(() => {});
  }, [ownerName]);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const qoloWidgetUrl = `${qoloWidgetOrigin()}/widgets/js/qolo.initialize.v3.js`;

  const widget = {
    frame: {
      container_id: 'widget_container_virtual',
      iframe_class:
        'fs-exclude widget-iframe aspect-[385/244] w-full mx-auto overflow-y-scroll border-0',
      spinner: false,
      display: 'flex',
      filter: 'invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%)',
      version: 'v3',
    },
    target_origin: qoloWidgetOrigin(),
    config: {
      token: token,
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
          background: `url("${CardAssets.BACKGROUND_BASE_64}")`,
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
          'background-image': `url("${CardAssets.COPY_ICON_SVG}")`,
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
    if (token && showWidget && scriptLoaded) {
      widget.config.token = token;
      window.pciWidget(widget);
    }
  }, [card, token, showWidget, scriptLoaded]);

  const handleViewCardInfo = async () => {
    setToken(await getVirtualCardToken(api, entity.id, card.id));
    onShowWidget();
  };

  return (
    <div className="relative w-full mx-auto">
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
            id="widget_container_virtual"
            className="aspect-[385/244] relative overflow-hidden rounded-xl"
          >
            {!token && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-20">
                <div className="text-center text-gray-500">No card data available</div>
              </div>
            )}
          </div>

          {/* Qolo's show_pan widget does not support displaying cardholder name natively.
              The token endpoint only accepts card_proxy (person_guid is for external_payment only).
              This overlay renders the name from the entity context for Amazon borrowers. */}
          {showOwnerName && (
            <div
              className="absolute left-6 flex items-center gap-2 z-30"
              style={{ top: '55%' }}
              data-testid="owner-name-field"
            >
              <span className="text-white text-lg sm:text-2xl font-semibold">{ownerName}</span>
              <button
                type="button"
                onClick={handleCopyName}
                className={`transition-opacity ${nameCopied ? 'opacity-[0.65]' : 'hover:opacity-80'}`}
                aria-label="Copy cardholder name"
                style={{
                  backgroundImage: `url("${CardAssets.COPY_ICON_SVG}")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  backgroundSize: 'contain',
                  width: '1.25rem',
                  height: '1.25rem',
                }}
              />
            </div>
          )}

          <div className="absolute bottom-6 right-6 flex justify-center z-30">
            <button
              onClick={() => onHideWidget()}
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
            {card.last_four && (
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-gray-200">Card Number</span>
                </div>
                <div className="text-sm sm:text-xl tracking-wider">
                  {formatCardNumber(card.last_four)}
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
