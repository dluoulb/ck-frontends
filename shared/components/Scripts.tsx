import React, { useEffect } from 'react';
import Head from 'next/head';

export default function Scripts() {
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENV !== 'development') {
      window.ckLoadZendeskWidget();
    }
  }, []);

  return (
    <div>
      <Head>
        {/* Zendesk Widget Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
          window.ckLoadZendeskWidget = function() {
            if (window.zEACLoaded) return Promise.resolve();
            window.zESettings = {
              webWidget: {
                chat: {
                  notifications: {
                    mobile: {
                      disable: true
                    }
                  }
                }
              }
            };
            var script = document.createElement('script');
            script.type = 'text/javascript';
            script.id = 'ze-snippet';
            script.async = true;
            script.src = 'https://static.zdassets.com/ekr/snippet.js?key=b115523b-cee9-4d74-a8c4-e27327166184';
            document.getElementsByTagName('head')[0].appendChild(script);
            return new Promise((res, rej) => {
              script.onload = function() {
                res();
              }
              script.onerror = function () {
                rej();
              }
            });
          };
        `,
          }}
        />

        {/* Google Analytics Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
          var node_env = '${process.env.NODE_ENV}';
          if (node_env === 'production') {
            window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
            ga('create', 'UA-97258167-1', 'auto');
            ga('send', 'pageview');
          }
        `,
          }}
        />
        <script
          async
          src="https://www.google-analytics.com/analytics.js"
        ></script>
      </Head>
    </div>
  );
}
