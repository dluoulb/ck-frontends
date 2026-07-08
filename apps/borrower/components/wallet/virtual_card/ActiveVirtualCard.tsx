import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Script from 'next/script';

import useQoloWidget from '@apps/borrower/hooks/useQoloWidget';
import { useEntity } from '@contexts/EntityContext';
import useApi from '@hooks/useApi';
import useToast from '@hooks/useToast';
import { getVirtualCardToken } from '@lib/actions/companies';
import { CardStatus } from '@lib/constants/Enums';
import { qoloWidgetOrigin } from '@lib/constants/SiteVariables';
import vcSvg from '@lib/images/vc.svg';
import { captureEvent } from '@lib/posthog';
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
  const { makeToast } = useToast();
  const [token, setToken] = useState();
  const { entity } = useEntity();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [nameCopied, setNameCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isAmazonExclusive = entity?.isAmazonExclusive ?? false;
  const owner = entity?.type === 'company' ? entity?.borrower : entity?.user;
  const ownerName = owner ? `${owner.first_name || ''} ${owner.last_name || ''}`.trim() : '';
  const showOwnerName = isAmazonExclusive && !!ownerName;

  const [isTokenLoading, setIsTokenLoading] = useState(false);

  const { iframeReady, onWidgetSuccess } = useQoloWidget({
    containerId: 'widget_container_virtual',
    showWidget,
    onHideWidget,
    onCleanup: () => setToken(undefined),
  });

  const widgetVisible = showWidget && iframeReady && (!scriptLoaded || iframeLoaded);
  const isWaitingForWidgetReveal = showWidget && !widgetVisible;
  const isActionDisabled = isTokenLoading || isWaitingForWidgetReveal;
  const canViewCardDetails = card?.status !== CardStatus.SUSPEND;

  useEffect(() => {
    if (!showWidget) {
      setIframeLoaded(false);
    }
  }, [showWidget]);

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

  const handleWidgetFailure = useCallback(
    (details) => {
      const failureMessage =
        details?.error || details?.message || 'Unable to show card details. Please try again.';

      makeToast(failureMessage, 'error');
      setIframeLoaded(false);
      onHideWidget();
    },
    [makeToast, onHideWidget],
  );

  const widget = {
    onSuccess: onWidgetSuccess,
    onFailure: handleWidgetFailure,
    onLoadIframe: () => {
      setIframeLoaded(true);
    },
    frame: {
      container_id: 'widget_container_virtual',
      iframe_class:
        'fs-exclude ph-no-capture widget-iframe aspect-[385/244] w-full mx-auto overflow-y-scroll border-0',
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
  }, [token, showWidget, scriptLoaded]);

  const handleViewCardInfo = async () => {
    if (isActionDisabled || !entity?.id || !card?.id) return;

    setIsTokenLoading(true);
    try {
      const nextToken = await getVirtualCardToken(api, entity.id, card.id);
      setToken(nextToken);
      onShowWidget();
      captureEvent('virtual_card_viewed');
    } catch (error) {
      if (error?.response?.status === 429) {
        makeToast('Too many requests. Please wait a minute and try again.', 'error');
      } else {
        makeToast('Unable to load card details. Please try again.', 'error');
      }
    } finally {
      setIsTokenLoading(false);
    }
  };

  return (
    <div className="relative w-full mx-auto">
      <Script
        src={qoloWidgetUrl}
        onLoad={() => {
          setScriptLoaded(true);
        }}
        onError={() => {
          makeToast('Unable to load card details. Please refresh and try again.', 'error');
          setScriptLoaded(false);
          setIsTokenLoading(false);
          setToken(undefined);
          if (showWidget) {
            onHideWidget();
          }
        }}
      />

      {/* Masked card — always in DOM as the base layer */}
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

          {!widgetVisible && canViewCardDetails && (
            <div className="flex items-center justify-between">
              <button
                onClick={handleViewCardInfo}
                disabled={isActionDisabled}
                className="px-3 py-2 rounded-lg text-sm font-bold transition-colors bg-white hover:bg-white/90 text-primary-blue disabled:opacity-70"
              >
                {isActionDisabled ? 'Loading...' : 'View Card Info'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Qolo widget — overlays on top of masked card, only mounted when showWidget is true */}
      {showWidget && (
        <div
          className={`absolute inset-0 z-20 ${widgetVisible ? '' : 'opacity-0 pointer-events-none'}`}
        >
          <div
            id="widget_container_virtual"
            className="aspect-[385/244] relative overflow-hidden rounded-xl"
          />

          {/* Qolo's show_pan widget does not support displaying cardholder name natively.
              The token endpoint only accepts card_proxy (person_guid is for external_payment only).
              This overlay renders the name from the entity context for Amazon borrowers. */}
          {widgetVisible && showOwnerName && (
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
        </div>
      )}
    </div>
  );
}
