import React, { useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';

declare global {
  interface GAQueueFunction extends Function {
    q?: any[];
    l?: number;
  }

  var ga: GAQueueFunction;
}

export default function Scripts() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENV !== 'development') {
      window.ckLoadZendeskWidget?.();
    }
  }, []);

  return (
    <Head>
      {/* Load Zendesk Widget */}
      <Script
        src="https://static.zdassets.com/ekr/snippet.js?key=b115523b-cee9-4d74-a8c4-e27327166184"
        strategy="lazyOnload"
        onLoad={() => {
          window.ckLoadZendeskWidget = function () {
            if (window.zEACLoaded) return Promise.resolve();
            window.zESettings = {
              webWidget: {
                chat: {
                  notifications: {
                    mobile: {
                      disable: true,
                    },
                  },
                },
              },
            };
          };
        }}
      />

      {/* Google Analytics Script */}
      <Script
        src="https://www.google-analytics.com/analytics.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (process.env.NODE_ENV === 'production') {
            window.ga =
              window.ga ||
              function () {
                (ga.q = ga.q || []).push(arguments);
              };
            ga.l = +new Date();
            ga('create', 'UA-97258167-1', 'auto');
            ga('send', 'pageview');
          }
        }}
      />
    </Head>
  );
}
