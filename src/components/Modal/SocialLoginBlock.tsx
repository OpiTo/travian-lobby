import { useEffect, useState } from 'react';
import { useI18n } from '../../localization/i18n';
import { useNavigateWithParams, usePlayFlow } from '../../hooks';
import { useSearchParams } from 'react-router-dom';
import * as Identity from '../../services/identity';
import * as Lobby from '../../services/lobby';
import { getLocaleKey } from '../../data/locales';

// Generate random string for nonce/state
const generateRandomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => chars[byte % chars.length]).join('');
};

// Type declarations for social SDKs
interface GoogleAccounts {
  accounts: {
    id: {
      initialize: (config: Record<string, unknown>) => void;
      renderButton: (element: HTMLElement | null, config: Record<string, unknown>) => void;
    };
  };
}

interface FBStatusResponse {
  status: string;
  authResponse?: { accessToken: string };
}

interface FBSDK {
  init: (config: Record<string, unknown>) => void;
  getLoginStatus: (callback: (response: FBStatusResponse) => void) => void;
  login: (callback: (response: FBStatusResponse) => void, options: { scope: string }) => void;
}

interface AppleIDAuth {
  auth: {
    init: (config: Record<string, unknown>) => void;
    signIn: () => Promise<{ authorization: { id_token: string } }>;
  };
}

interface GRecaptcha {
  execute: (siteKey: string, options: { action: string }) => Promise<string>;
  render: (element: string, config: Record<string, unknown>) => void;
  reset: () => void;
}

// Access global objects with type safety
const getGoogle = (): GoogleAccounts | undefined => (window as unknown as { google?: GoogleAccounts }).google;
const getFB = (): FBSDK | undefined => (window as unknown as { FB?: FBSDK }).FB;
const getAppleID = (): AppleIDAuth | undefined => (window as unknown as { AppleID?: AppleIDAuth }).AppleID;
const getGrecaptcha = (): GRecaptcha | undefined => (window as unknown as { grecaptcha?: GRecaptcha }).grecaptcha;

interface SocialLoginBlockProps {
  onSuccess?: (provider: string, callback: (provider: string) => Promise<void>) => void;
  onError?: (provider: string, error?: { error?: string }) => void;
}

/**
 * Social Login Block component (be component in original)
 * Renders social login buttons for Google, Facebook, Apple.
 * Structure: div#socialBlock > div#socialSignIn
 */
const SocialLoginBlock = ({ onSuccess, onError }: SocialLoginBlockProps) => {
  const { translate, locale } = useI18n();
  const navigate = useNavigateWithParams();
  const playFlow = usePlayFlow();
  const [searchParams] = useSearchParams();

  // Check if social providers are configured
  const config = window.Config;
  const hasGoogle = !!config?.google?.client_id;
  const hasFacebook = !!config?.facebook?.client_id;
  const hasApple = !!config?.apple?.client_id;
  const hasSocialProviders = hasGoogle || hasFacebook || hasApple;

  if (!hasSocialProviders) {
    return null;
  }

  /**
   * Handle social login success (d function in original)
   */
  const handleSuccess = (provider: string, providerData: Record<string, unknown>) => {
    const callback = async (p: string) => {
      try {
        // Get captcha token if available
        const grecaptcha = getGrecaptcha();
        const captchaToken = await grecaptcha?.execute(
          window.Config?.captcha?.v3 || '',
          { action: 'authentication' }
        );

        const localeKey = getLocaleKey(locale);
        const options = {
          ...providerData,
          options: { locale: localeKey },
          attestation: { Captcha: captchaToken },
        };

        const result = await Identity.authenticateProvider(p as 'google' | 'facebook' | 'apple', options);
        const authOptions = { locale: localeKey };
        await Lobby.authorize(result.code, result.code_verifier, authOptions);

        // Trigger play flow
        await playFlow(searchParams);
      } catch (err: unknown) {
        const error = err as { body?: { error?: string; code?: string } };

        switch (error.body?.error) {
          case 'identity_needs_activation':
            navigate(`?code=${error.body.code}#activationSocial`);
            return;
          case 'no_email_address':
            navigate('?code=mailPermission#errorSocial');
            return;
          case 'identity_exists':
            navigate('?code=mailAlreadyUsed#errorSocial');
            return;
        }

        throw err;
      }
    };

    if (onSuccess) {
      onSuccess(provider, callback);
    } else {
      callback(provider).catch(() => {
        navigate('?code=genericRegistration#errorSocial');
      });
    }
  };

  /**
   * Handle social login error (h function in original)
   */
  const handleError = (provider: string, error?: { error?: string }) => {
    if (onError) {
      onError(provider, error);
    }
  };

  return (
    <div id="socialBlock">
      <div id="socialSignIn">
        <span className="label">{translate('or continue with')}</span>
        {hasGoogle && (
          <GoogleButton
            clientId={config.google.client_id}
            onSuccess={handleSuccess}
          />
        )}
        {hasFacebook && (
          <FacebookButton
            clientId={config.facebook.client_id}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        )}
        {hasApple && (
          <AppleButton
            clientId={config.apple.client_id}
            onSuccess={handleSuccess}
            onError={handleError}
          />
        )}
      </div>
    </div>
  );
};

/**
 * Script loader hook (ve function in original)
 */
const useScript = (src: string): boolean => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.addEventListener('load', () => setLoaded(true));
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [src]);

  return loaded;
};

/**
 * Google sign-in button (je component in original)
 */
interface GoogleButtonProps {
  clientId: string;
  onSuccess: (provider: string, data: Record<string, unknown>) => void;
}

const GoogleButton = ({ clientId, onSuccess }: GoogleButtonProps) => {
  const scriptLoaded = useScript('https://accounts.google.com/gsi/client');

  useEffect(() => {
    const google = getGoogle();
    if (scriptLoaded && google) {
      const nonce = generateRandomString(16);

      google.accounts.id.initialize({
        client_id: clientId,
        nonce,
        callback: (response: { credential: string }) => {
          onSuccess('google', response);
        },
      });

      google.accounts.id.renderButton(
        document.getElementById('googleSignInButton'),
        {
          type: 'icon',
          size: 'large',
          shape: 'rectangular',
        }
      );
    }
  }, [scriptLoaded, clientId, onSuccess]);

  return <div id="googleSignInButton" />;
};

/**
 * Facebook sign-in button (we component in original)
 */
interface FacebookButtonProps {
  clientId: string;
  onSuccess: (provider: string, data: Record<string, unknown>) => void;
  onError: (provider: string, error?: { error?: string }, response?: unknown) => void;
}

const FacebookButton = ({ clientId, onSuccess, onError }: FacebookButtonProps) => {
  const scriptLoaded = useScript('https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v22.0');

  useEffect(() => {
    const FB = getFB();
    if (scriptLoaded && FB) {
      FB.init({
        appId: clientId,
        cookie: false,
        logging: false,
        status: false,
        xfbml: false,
        version: 'v22.0',
      });
    }
  }, [scriptLoaded, clientId]);

  const handleClick = () => {
    const FB = getFB();
    if (!FB) return;

    FB.getLoginStatus((statusResponse) => {
      if (statusResponse.status !== 'connected') {
        FB.login(
          (loginResponse) => {
            if (loginResponse.status !== 'connected') {
              onError('facebook', undefined, loginResponse);
            } else {
              onSuccess('facebook', {
                accessToken: loginResponse.authResponse?.accessToken,
                client_id: clientId,
              });
            }
          },
          { scope: 'public_profile, email' }
        );
      } else {
        onSuccess('facebook', {
          accessToken: statusResponse.authResponse?.accessToken,
          client_id: clientId,
        });
      }
    });
  };

  return (
    <div id="facebookSignInButton">
      <button onClick={handleClick}>
        <FacebookIcon />
      </button>
    </div>
  );
};

/**
 * Apple sign-in button (ye component in original)
 */
interface AppleButtonProps {
  clientId: string;
  onSuccess: (provider: string, data: Record<string, unknown>) => void;
  onError: (provider: string, error?: { error?: string }) => void;
}

const AppleButton = ({ clientId, onSuccess, onError }: AppleButtonProps) => {
  const scriptLoaded = useScript('https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js');
  const [state] = useState(() => generateRandomString(32));

  useEffect(() => {
    const AppleID = getAppleID();
    if (scriptLoaded && AppleID) {
      AppleID.auth.init({
        clientId,
        scope: 'name email',
        redirectURI: window.location.origin,
        state,
        nonce: generateRandomString(16),
        usePopup: true,
      });
    }
  }, [scriptLoaded, clientId, state]);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    const AppleID = getAppleID();
    if (!AppleID) return;

    try {
      const response = await AppleID.auth.signIn();
      onSuccess('apple', {
        id_token: response.authorization.id_token,
        state,
      });
    } catch (err) {
      onError('apple', err as { error?: string });
    }
  };

  return (
    <div
      id="appleid-signin"
      data-mode="logo-only"
      data-type="sign-in"
      data-color="black"
      data-border="false"
      data-border-radius="4"
      onClick={handleClick}
    />
  );
};

/**
 * Facebook icon (fe component in original)
 */
const FacebookIcon = () => (
  <svg viewBox="0 0 2048 2048">
    <path d="M 1014.5,-0.5 C 1032.5,-0.5 1050.5,-0.5 1068.5,-0.5C 1316.3,8.56358 1534.3,92.7302 1722.5,252C 1905.16,412.288 2020,612.455 2067,852.5C 2075.48,899.978 2080.98,947.644 2083.5,995.5C 2083.5,1026.5 2083.5,1057.5 2083.5,1088.5C 2066.21,1376.48 1952.54,1618.31 1742.5,1814C 1578.82,1960.81 1387.15,2048.31 1167.5,2076.5C 1167.5,1837.5 1167.5,1598.5 1167.5,1359.5C 1261.5,1359.5 1355.5,1359.5 1449.5,1359.5C 1468.83,1253.83 1488.17,1148.17 1507.5,1042.5C 1394.17,1042.5 1280.83,1042.5 1167.5,1042.5C 1167.33,996.832 1167.5,951.165 1168,905.5C 1168.7,871.955 1174.37,839.289 1185,807.5C 1202.17,762.333 1233.33,731.167 1278.5,714C 1307.03,704.245 1336.36,698.578 1366.5,697C 1419.21,695.101 1471.88,695.934 1524.5,699.5C 1524.5,603.5 1524.5,507.5 1524.5,411.5C 1425.52,390.426 1325.52,382.926 1224.5,389C 1159.56,393.053 1096.89,407.053 1036.5,431C 932.366,475.804 862.199,551.97 826,659.5C 803.192,730.685 791.525,803.685 791,878.5C 790.5,933.166 790.333,987.832 790.5,1042.5C 718.833,1042.5 647.167,1042.5 575.5,1042.5C 575.5,1148.17 575.5,1253.83 575.5,1359.5C 647.167,1359.5 718.833,1359.5 790.5,1359.5C 790.833,1590.83 790.5,1822.17 789.5,2053.5C 543.691,1989.11 345.858,1855.11 196,1651.5C 71.9976,1477.33 6.49762,1283 -0.5,1068.5C -0.5,1050.5 -0.5,1032.5 -0.5,1014.5C 11.3901,728.626 119.057,486.126 322.5,287C 516.795,105.745 747.461,9.912 1014.5,-0.5 Z" />
  </svg>
);

export default SocialLoginBlock;
