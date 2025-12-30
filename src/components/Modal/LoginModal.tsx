import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Modal from './Modal';
import { Button } from '../common';
import { ValidIcon, InvalidIcon, VisibilityIcon } from './Icons';
import SocialLoginBlock from './SocialLoginBlock';
import { useI18n } from '../../localization/i18n';
import { useAuth, useNavigateWithParams, usePlayFlow } from '../../hooks';
import FormValidator from '../../utils/FormValidator';
import * as Identity from '../../services/identity';
import * as Lobby from '../../services/lobby';
import { getLocaleKey } from '../../data/locales';

interface LoginModalProps {
  onClose: () => void;
}

/**
 * Login Modal component (aa component in original)
 * Matches original login flow using Identity + Lobby APIs
 */
const LoginModal = ({ onClose }: LoginModalProps) => {
  const { translate, locale } = useI18n();
  const { account, refreshSession } = useAuth();
  const navigate = useNavigateWithParams();
  const playFlow = usePlayFlow();
  const [searchParams] = useSearchParams();

  const formRef = useRef<HTMLFormElement>(null);
  const validatorRef = useRef(new FormValidator(formRef));

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    // If already logged in and has server/uc params, trigger play flow
    if (account !== null && (searchParams.get('server') || searchParams.get('uc'))) {
      playFlow(searchParams);
    }
    validatorRef.current?.attach();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    validatorRef.current?.validateForm();
    if (isLoading || !validatorRef.current?.formValid) return;

    const formData = new FormData(formRef.current || undefined);
    setIsLoading(true);

    try {
      const name = formData.get('name') as string;
      const password = formData.get('password') as string;

      const { code, code_verifier } = await Identity.authenticateLogin(name, password);
      const localeKey = getLocaleKey(locale);
      await Lobby.authorize(code, code_verifier, { locale: localeKey });

      // Refresh auth state and trigger play flow
      await refreshSession();
      await playFlow(searchParams);
    } catch (err: unknown) {
      const error = err as { body?: { error?: string; code?: string; sign?: string; message?: string } };

      // Handle activation required
      if (error.body?.error === 'identity_needs_activation') {
        const email = (formRef.current?.querySelector('input[name="name"]') as HTMLInputElement)?.value;
        navigate(`?code=${error.body.code}&email=${email}&sign=${error.body.sign}#activation`);
        return;
      }

      setError(translate(error.body?.message || 'Unexpected Error'));
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(undefined);
  };

  const handleSocialSuccess = async (provider: string, callback: (provider: string) => Promise<void>) => {
    setIsLoading(true);
    try {
      await callback(provider);
    } catch {
      setIsLoading(false);
      navigate('?code=genericLogin#errorSocial');
    }
  };

  const handleSocialError = async (_provider: string, error?: { error?: string }) => {
    navigate(
      `?code=${error?.error === 'popup_blocked_by_browser' ? 'popupBlockedLogin' : 'genericLogin'}#errorSocial`
    );
  };

  return (
    <Modal id="loginLobby" onClose={onClose} closeButton>
      <h1>{translate('Login to Lobby Account')}</h1>
      <form ref={formRef}>
        <label className={`text ${error ? 'withCustomValidationRenderElement' : ''}`}>
          <input
            type="text"
            name="name"
            placeholder={translate('Email address / account name')}
            onFocus={clearError}
            onChange={clearError}
            defaultValue={searchParams.get('email') || undefined}
          />
          <div className="label">
            {translate('Enter your email address or account name')}:
          </div>
          <ValidIcon className="valid" />
          <InvalidIcon className="invalid" />
          <div className="validation" data-rule={FormValidator.NOT_EMPTY}>
            {translate('Please enter your email address or account name')}
          </div>
        </label>

        <label className={`text ${error ? 'invalid' : ''}`}>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder={translate('Password')}
            onFocus={clearError}
            onChange={clearError}
          />
          <div className="label">{translate('Enter your password')}:</div>
          <ValidIcon className="valid" />
          <InvalidIcon className="invalid" />
          <VisibilityIcon
            className="visibility"
            onClick={(e) => {
              e.preventDefault();
              setShowPassword(!showPassword);
            }}
          />
          <div className="validation" data-rule={FormValidator.NOT_EMPTY}>
            {translate('Please enter your password')}
          </div>
          {error && (
            <div className="validation show" data-rule={FormValidator.NO_CUSTOM_ERROR}>
              {error}
            </div>
          )}
        </label>

        <div id="g-recaptcha" className="gCaptcha" />

        <div className="actions">
          <Button
            type="submit"
            onClick={handleSubmit}
            onSubmit={handleSubmit}
            disabledAttribute={!!error || isLoading}
            withLoadingIndicator
            isLoading={isLoading}
          >
            {translate('Login')}
          </Button>

          <SocialLoginBlock
            onSuccess={handleSocialSuccess}
            onError={handleSocialError}
          />

          <div>
            {translate('Forgot your password?')}{' '}
            <a href="#passwordRecovery" title="">
              {translate('Recover')}
            </a>
          </div>
          <div>
            {translate("Don't have an account yet?")}{' '}
            <a href="#registration" title="">
              {translate('Register')}
            </a>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default LoginModal;
