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

          {/* NPS Snippet */}
          <Script strategy="beforeInteractive" id="nps-delighted">
            {
              // @ts-ignore
              // prettier-ignore
              !function(e,t,r,n){if(!e[n]){for(var a=e[n]=[],i=["survey","reset","config","init","set","get","event","identify","track","page","screen","group","alias"],c=0;c<i.length;c++){var s=i[c];a[s]=a[s]||function(e){return function(){var t=Array.prototype.slice.call(arguments);a.push([e,t])}}(s)}a.SNIPPET_VERSION="1.0.1";var o=t.createElement("script");o.type="text/javascript",o.async=!0,o.src="https://d2yyd1h5u9mauk.cloudfront.net/integrations/web/v1/library/"+r+"/"+n+".js";var p=t.getElementsByTagName("script")[0];p.parentNode.insertBefore(o,p)}}(window,document,"QnV7kQpj9c4BitOu","delighted")
            }
          </Script>

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
