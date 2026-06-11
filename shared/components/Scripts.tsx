import Script from 'next/script';

import { platform } from '@lib/constants/SiteVariables';

declare global {
  interface GAQueueFunction {
    (...args: unknown[]): void;
    q?: unknown[][];
    l?: number;
  }

  var ga: GAQueueFunction;
}

// We need a HEAP_APP_ID if we actually want to use this.
//
// {/* HEAP Analytics Snippet */}
// <Script
//   id="heap-analytics"
//   strategy="afterInteractive"
//   dangerouslySetInnerHTML={{
//     __html: `
//     window.heap=window.heap||[],heap.load=function(e,t){
//       window.heap.appid=e,window.heap.config=t=t||{};
//       var r=t.forceSSL||"https:"===document.location.protocol,
//       a=document.createElement("script");
//       a.type="text/javascript",a.async=!0,
//       a.src=(r?"https:":"http:")+"//cdn.heapanalytics.com/js/heap-"+e+".js";
//       var n=document.getElementsByTagName("script")[0];
//       n.parentNode.insertBefore(a,n);
//       for(var o=function(e){return function(){heap.push([e].concat(Array.prototype.slice.call(arguments,0)))}},
//       p=["addEventProperties","addUserProperties","clearEventProperties","identify","resetIdentity","removeEventProperty","setEventProperties","track","unsetEventProperty"],c=0;c<p.length;c++)
//         heap[p[c]]=o(p[c])
//     };
//     heap.load("YOUR_HEAP_APP_ID"); // Replace with your actual Heap app ID
//   `,
//   }}
// />

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
              // @ts-expect-error Inline vendor snippet intentionally uses legacy JS syntax.
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
