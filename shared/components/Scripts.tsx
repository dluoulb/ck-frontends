import Script from 'next/script';

import { platform } from '@lib/constants/SiteVariables';

declare global {
  interface GAQueueFunction extends Function {
    q?: any[];
    l?: number;
  }

  var ga: GAQueueFunction;
}

export default function Scripts() {
  const isProduction = platform() === 'production';

  return (
    <>
      {/* Load Workbetter Widget */}
      {isProduction && (
        <>
          <Script
            id="ze-snippet"
            strategy="afterInteractive"
            src="https://static.zdassets.com/ekr/snippet.js?key=b115523b-cee9-4d74-a8c4-e27327166184"
          />

          {/* Google Analytics Script */}
          <Script
            src="https://www.google-analytics.com/analytics.js"
            strategy="afterInteractive"
            onLoad={() => {
              if (process.env.NEXT_PUBLIC_ENV === 'production') {
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
        </>
      )}
    </>
  );
}
