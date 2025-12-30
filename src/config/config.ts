interface LobbyConfig {
  host: string;
}

interface IdentityConfig {
  client_id: string;
  host: string;
}

interface CaptchaConfig {
  v2: string;
  v3: string;
}

interface SocialConfig {
  client_id: string;
}

export interface AppConfig {
  lobby: LobbyConfig;
  identity: IdentityConfig;
  captcha: CaptchaConfig;
  apple: SocialConfig;
  facebook: SocialConfig;
  google: SocialConfig;
  enableDev?: boolean;
}

// Production configuration
const productionConfig: AppConfig = {
  lobby: { host: "https://lobby.legends.travian.com" },
  identity: {
    client_id: "HIaSfC2LNQ1yXOMuY7Pc2uIH3EqkAi26",
    host: "https://identity.service.legends.travian.info",
  },
  captcha: {
    v2: "6LfD1kMUAAAAAENuJ7iNDd8OOgD3DjaQV4iPknlc",
    v3: "6Lfk8KEUAAAAAKV9GWukdEyal6qVjhUaj5Dfb6bP",
  },
  apple: { client_id: "com.traviangames.travianlegendsmobile.auth" },
  facebook: { client_id: "1377350219978614" },
  google: { client_id: "574861169216-hr3f427db4mka3q78em4si5hgs666d52.apps.googleusercontent.com" },
};

// Local development configuration
const localConfig: AppConfig = {
  lobby: { host: "http://localhost:8080" },
  identity: {
    client_id: "travian-lobby",
    host: "http://localhost:8080",
  },
  captcha: { v2: "", v3: "" },
  apple: { client_id: "" },
  facebook: { client_id: "" },
  google: { client_id: "" },
  enableDev: true,
};

// Determine which config to use based on environment
const isLocalDev = import.meta.env.DEV || window.location.hostname === "localhost";

// Export the appropriate config
export const config: AppConfig = isLocalDev ? localConfig : productionConfig;

// Initialize config on window object
export function initConfig(): void {
  window.Config = config;
}

// TypeScript global declaration for window.Config
declare global {
  interface Window {
    Config: AppConfig;
  }
}
