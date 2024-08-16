// src/global.d.ts or types/global.d.ts

declare global {
  interface Window {
    ckLoadZendeskWidget: () => Promise<void>;
  }
}

export {};
