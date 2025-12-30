import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Modal from './Modal';
import { Button } from '../common';
import { ValidIcon, InvalidIcon, CheckboxIcon, ArrowCircleForwardIcon } from './Icons';
import SocialLoginBlock from './SocialLoginBlock';
import { useI18n } from '../../localization/i18n';
import { useNavigateWithParams } from '../../hooks';
import { FormValidator, getTermsUrl, getWithdrawalUrl, getPrivacyUrl } from '../../utils';
import { getLocaleKey } from '../../data/locales';
import * as Identity from '../../services/identity';

interface RegistrationModalProps {
  onClose: () => void;
}

let redirectTimeout: ReturnType<typeof setTimeout>;

/**
 * Registration Modal component (Ce component in original)
 * Matches original registration flow using Identity API
 * Endpoint: POST /provider/login/register
 */
const RegistrationModal = ({ onClose }: RegistrationModalProps) => {
  const { translate, locale } = useI18n();
  const navigate = useNavigateWithParams();
  const [searchParams] = useSearchParams();

  const formRef = useRef<HTMLFormElement>(null);
  const validatorRef = useRef(new FormValidator(formRef));
  const emailInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accountExists, setAccountExists] = useState(false);

  useEffect(() => {
    validatorRef.current?.attach();
    emailInputRef.current?.focus();
    return () => {
      clearTimeout(redirectTimeout);
    };
  }, []);

  // Handle redirect when account exists
  useEffect(() => {
    clearTimeout(redirectTimeout);
    setIsLoading(false);
    if (accountExists) {
      setIsLoading(true);
      redirectTimeout = setTimeout(() => {
        navigate('?email=' + emailInputRef.current?.value + '#loginLobby');
      }, 3000);
    }
  }, [accountExists]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    validatorRef.current?.validateForm();
    if (isLoading || !validatorRef.current?.formValid) return;

    const formData = new FormData(formRef.current || undefined);
    setIsLoading(true);

    const email = formData.get('email') as string;
    const localeKey = getLocaleKey(locale);
    const options = {
      newsletter: !!formData.get('newsletter'),
      locale: localeKey,
    };

    try {
      // Build context from search params
      const context = {
        server: searchParams.get('server') || undefined,
        ad: searchParams.get('ad') || undefined,
        uc: searchParams.get('uc') || undefined,
      };

      // Get captcha token if available
      const captchaToken = await (window as unknown as { grecaptcha?: { execute: (key: string, opts: { action: string }) => Promise<string> } })
        .grecaptcha?.execute(window.Config?.captcha?.v3 || '', { action: 'registration' });

      await Identity.register(email, {
        attestation: { Captcha: captchaToken },
        options,
        context,
      } as unknown as Parameters<typeof Identity.register>[1]);
    } catch (err: unknown) {
      const apiError = err as { body?: { error?: string; code?: string; sign?: string; message?: string } };

      switch (apiError.body?.error) {
        case 'identity_exists':
          setError(translate('Your email address is already connected to a Legends Lobby Account.'));
          setAccountExists(true);
          break;
        case 'identity_needs_activation':
          navigate(`?code=${apiError.body.code}&email=${email}&sign=${apiError.body.sign}#activation`);
          break;
        default:
          setError(translate(apiError.body?.message || 'Unexpected Error'));
          setIsLoading(false);
      }
    }
  };

  const clearError = () => {
    setError(null);
  };

  const handleSocialSuccess = async (provider: string, callback: (provider: string) => Promise<void>) => {
    setIsLoading(true);
    try {
      await callback(provider);
    } catch {
      setIsLoading(false);
      navigate('?code=genericRegistration#errorSocial');
    }
  };

  const handleSocialError = async (_provider: string, error?: { error?: string }) => {
    navigate(
      `?code=${error?.error === 'popup_blocked_by_browser' ? 'popupBlockedRegistration' : 'genericRegistration'}#errorSocial`
    );
  };

  // Build legal text HTML (matches original registrationLegalText pattern)
  const legalTextHtml = translate('registrationLegalText', {
    QUOTE: '&quot;',
    GTC: `<a href="${getTermsUrl(locale.language)}" target="_blank" rel="noopener noreferrer">${translate('GTC')}</a>`,
    INFORMATION_RIGHT_OF_WITHDRAWAL: `<a href="${getWithdrawalUrl(locale.language)}" target="_blank" rel="noopener noreferrer">${translate('Information on the Right of Withdrawal')}</a>`,
    PRIVACY_POLICY: `<a href="${getPrivacyUrl(locale.language)}" target="_blank" rel="noopener noreferrer">${translate('Privacy Policy')}</a>`,
  });

  return (
    <Modal id="registrationFlowWrapper" onClose={onClose} closeButton>
      <div className="step active" data-step="email">
        <h1>{translate('Create Legends Lobby Account')}</h1>
        <form ref={formRef}>
          <label className={`text ${error ? 'withCustomValidationRenderElement' : ''} ${accountExists ? 'positiveError' : ''}`}>
            <input
              type="text"
              name="email"
              placeholder={translate('Enter your email address')}
              onFocus={clearError}
              ref={emailInputRef}
            />
            <div className="label">{translate('Email Address')}:</div>
            <ValidIcon className="valid" />
            <InvalidIcon className="invalid" />
            <div className="validation" data-rule={FormValidator.NOT_EMPTY}>
              {translate('Please enter your email address')}
            </div>
            <div className="validation" data-rule={FormValidator.IS_EMAIL}>
              {translate('Please enter a valid email address. E.g. mymail@provider.com')}
            </div>
            {error && (
              <div
                className={`validation custom ${accountExists ? 'positive' : ''}`}
                data-rule={FormValidator.NO_CUSTOM_ERROR}
              >
                {error}
              </div>
            )}
          </label>

          {/* Account exists redirect notice */}
          {accountExists && (
            <div className="accountExistsRedirect">
              <ArrowCircleForwardIcon className="arrowCircleForward" />
              <span>{translate('Redirecting to Login')}</span>
              <a
                className="negative"
                onClick={() => {
                  setAccountExists(false);
                }}
              >
                {translate('Cancel')}
              </a>
            </div>
          )}

          <label className="checkbox">
            <input type="checkbox" name="newsletter" value="1" defaultChecked={false} />
            <CheckboxIcon className="checkbox" />
            <div className="label">
              {translate('I want to receive the newsletter')}
            </div>
          </label>

          <p
            className="legalText"
            dangerouslySetInnerHTML={{ __html: legalTextHtml }}
          />

          <div className="actions">
            <Button
              type="submit"
              onClick={handleSubmit}
              onSubmit={handleSubmit}
              disabledAttribute={!!error || isLoading}
              withLoadingIndicator
              isLoading={isLoading}
            >
              {translate('Register with email address')}
            </Button>

            <SocialLoginBlock
              onSuccess={handleSocialSuccess}
              onError={handleSocialError}
            />

            <div>
              {translate('Already have an account?')}{' '}
              <a href="#loginLobby" title="">
                {translate('Login now')}
              </a>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default RegistrationModal;
