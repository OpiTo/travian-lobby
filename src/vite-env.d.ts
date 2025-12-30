/// <reference types="vite/client" />

// Global type declarations for social SDKs and app config
declare global {
  interface Window {
    Config?: AppConfig;
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          renderButton: (element: HTMLElement | null, config: Record<string, unknown>) => void;
        };
      };
    };
    FB?: {
      init: (config: Record<string, unknown>) => void;
      getLoginStatus: (callback: (response: FBStatusResponse) => void) => void;
      login: (callback: (response: FBStatusResponse) => void, options: { scope: string }) => void;
    };
    AppleID?: {
      auth: {
        init: (config: Record<string, unknown>) => void;
        signIn: () => Promise<{ authorization: { id_token: string } }>;
      };
    };
    grecaptcha?: {
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      render: (element: string, config: Record<string, unknown>) => void;
      reset: () => void;
    };
  }
}

interface FBStatusResponse {
  status: string;
  authResponse?: {
    accessToken: string;
  };
}

interface AppConfig {
  enableDev?: boolean;
  google?: { client_id: string };
  facebook?: { client_id: string };
  apple?: { client_id: string };
  captcha?: { v3: string; v2: string };
  lobby?: { host: string };
  identity?: { host: string; client_id: string };
}

export { };
