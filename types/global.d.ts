import { FullStory } from '@fullstory/browser';

declare global {
  interface Window {
    ckLoadZendeskWidget?: () => Promise<void>;
    zE?: (api: string, action: string) => void;
    zEACLoaded?: boolean;
    zESettings?: any;
    ga?: GAQueueFunction;
    FS?: typeof FullStory & {
      getCurrentSessionURL?: (includeHash: boolean) => string;
    };
  }
}

export {};
