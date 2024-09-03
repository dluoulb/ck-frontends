import { FullStory } from '@fullstory/browser';

declare global {
  interface HostedTokenizationForm {
    mount: (selector: string) => HostedTokenizationForm;
    on: (event: string, callback: (event: Event) => void) => void;
    setStyles: (styles: Record<string, unknown>) => void;
  }

  interface HostedTokenization {
    create: (formType: string) => HostedTokenizationForm;
  }

  interface Window {
    ckLoadZendeskWidget?: () => Promise<void>;
    zE?: (api: string, action: string) => void;
    zEACLoaded?: boolean;
    zESettings?: any;
    ga?: GAQueueFunction;
    FS?: typeof FullStory & {
      getCurrentSessionURL?: (includeHash: boolean) => string;
    };
    HostedTokenization?: (token: string) => HostedTokenization;
  }
}

export {};
