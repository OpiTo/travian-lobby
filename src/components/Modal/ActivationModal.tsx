import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Modal from './Modal';
import { useI18n } from '../../localization/i18n';
import { ValidIcon, InvalidIcon } from './Icons';
import { activate, resendActivationEmail } from '../../services/identity';
import { authorize, passwordChangeConfirm, setName, graphql } from '../../services/lobby';
import { useAuth } from '../../hooks';

// Steps enum matching original We
enum Steps {
  activation = 'activation',
  password = 'password',
  username = 'username',
  success = 'success',
}

const ACTIVATION_CODE_LENGTH = 6;

interface ActivationModalProps {
  code: string;
  onClose: () => void;
}

interface AccountInfo {
  avatars: Array<{ uuid: string; name: string }>;
  session: { identity: { name: string } };
}

/**
 * Activation Modal (ze component in original)
 * Multi-step activation flow: activation code -> password -> username -> success
 */
const ActivationModal = ({ code, onClose }: ActivationModalProps) => {
  const { refreshSession } = useAuth();
  const [step, setStep] = useState<Steps>(Steps.activation);
  const [accountInfo, setAccountInfo] = useState<AccountInfo>({
    avatars: [],
    session: { identity: { name: '' } },
  });
  const [context, setContext] = useState<string>();

  useEffect(() => {
    const input = document.querySelector(
      '#registrationFlowWrapper .step.active input:first-of-type'
    ) as HTMLInputElement;
    if (input) {
      input.focus();
    } else {
      const button = document.querySelector(
        '#registrationFlowWrapper .step.active button.withText'
      ) as HTMLButtonElement;
      button?.focus();
    }
  }, [step]);

  const handleActivationComplete = (ctx?: string) => {
    setContext(ctx);
    setStep(Steps.password);
  };

  const handlePasswordComplete = () => {
    setStep(Steps.username);
  };

  const handleUsernameComplete = async () => {
    const info = await graphql<AccountInfo>('{avatars{uuid name} session{identity{name}}}');
    setAccountInfo(info);
    // Refresh auth state so the app knows user is logged in
    await refreshSession();
    setStep(Steps.success);
  };

  const canClose = ![Steps.password, Steps.username].includes(step);
  const closeHandler = canClose ? onClose : () => {};

  return (
    <Modal
      id="registrationFlowWrapper"
      onClose={closeHandler}
      closeButton={canClose}
      dataStep={step}
    >
      {Object.values(Steps).map((s) => {
        const isActive = s === step;
        return (
          <div key={s} className={`step ${isActive ? 'active' : ''}`} data-step={s}>
            {s === Steps.activation && (
              <ActivationStep code={code} onClose={onClose} onComplete={handleActivationComplete} />
            )}
            {s === Steps.password && (
              <PasswordStep code={code} onClose={onClose} onComplete={handlePasswordComplete} />
            )}
            {s === Steps.username && (
              <UsernameStep onClose={onClose} onComplete={handleUsernameComplete} />
            )}
            {s === Steps.success && (
              <SuccessStep onClose={onClose} info={accountInfo} context={context} />
            )}
          </div>
        );
      })}
    </Modal>
  );
};


// Countdown timer component
interface CountdownProps {
  seconds: number;
  onComplete: () => void;
}

const Countdown = ({ seconds, onComplete }: CountdownProps) => {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    if (remaining <= 0) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => setRemaining(remaining - 1), 1000);
    return () => clearTimeout(timer);
  }, [remaining, onComplete]);

  return <>{remaining}</>;
};

// Digits missing indicator (Ee component)
interface DigitsMissingProps {
  digitsMissing: boolean;
  code: string;
}

const DigitsMissing = ({ digitsMissing, code }: DigitsMissingProps) => {
  const { translate } = useI18n();
  if (!digitsMissing) return null;

  const missing = ACTIVATION_CODE_LENGTH - code.length;
  return (
    <div className="digitsMissing">
      <span>{missing}</span> {translate('digits')}
    </div>
  );
};

// Step 1: Activation code entry (ke component)
interface ActivationStepProps {
  code: string;
  onClose: () => void;
  onComplete: (context?: string) => void;
}

const ActivationStep = ({ code, onComplete }: ActivationStepProps) => {
  const { translate } = useI18n();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [activationCode, setActivationCode] = useState(searchParams.get('activationCode') ?? '');
  const [isExpired, setIsExpired] = useState(false);
  const [resendCooldown, setResendCooldown] = useState<number>();

  useEffect(() => {
    verifySignature();
  }, []);

  const verifySignature = async () => {
    const sign = searchParams.get('sign');
    const emailParam = searchParams.get('email');
    if (!sign || !emailParam) return;

    // Simplified signature verification - in original uses crypto.subtle
    // For now just set the email if params exist
    setEmail(emailParam);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || activationCode.length < ACTIVATION_CODE_LENGTH) return;

    setIsLoading(true);
    try {
      const result = await activate(code, {
        acceptTermsAndConditions: true,
        activationCode,
      });
      await authorize(result.code, result.code_verifier);
      onComplete(result.context);
    } catch (err: unknown) {
      const error = err as { body?: { error?: string; message?: string } };
      switch (error.body?.error) {
        case 'invalid_request':
          setIsExpired(true);
          setError(
            translate(
              'The activation code is incorrect. Please enter the activation code that you received in the email.'
            )
          );
          break;
        case 'invalid_activation_code':
          setError(
            translate(
              'The activation code is incorrect. Please enter the activation code that you received in the email.'
            )
          );
          break;
        default:
          setError(translate(error.body?.message || 'Unexpected error'));
      }
      setIsLoading(false);
    }
  };

  const handleStartAgain = () => {
    navigate('#registration');
  };

  const handleResend = async () => {
    if (resendCooldown !== undefined) return;
    try {
      const cooldownDate = await resendActivationEmail(code);
      const seconds = Math.ceil((cooldownDate.getTime() - Date.now()) / 1000);
      setResendCooldown(seconds > 0 ? seconds : undefined);
    } catch (err: unknown) {
      const error = err as { body?: { message?: string } };
      setError(translate(error.body?.message || 'Unexpected error'));
    }
  };

  const digitsMissing = activationCode.length < ACTIVATION_CODE_LENGTH;
  const emailMessage = translate('We sent you an activation link to: {email}', {
    email: `<strong>${email}</strong>`,
  });

  return (
    <div className="stepWrapper">
      <h1>{translate('Activate Legends Lobby account')}</h1>
      <p>
        <span dangerouslySetInnerHTML={{ __html: emailMessage }} />
        <br />
        <span>{translate('Please follow the instructions in the email to continue.')}</span>
      </p>
      <form ref={formRef}>
        <label className="text">
          <input
            type="text"
            name="code"
            placeholder={translate('E.g. 123456')}
            maxLength={ACTIVATION_CODE_LENGTH}
            onFocus={() => setError(null)}
            value={activationCode}
            onChange={(e) => setActivationCode(e.target.value.replace(/\D/g, ''))}
            tabIndex={0}
          />
          <div className="label">{translate('Enter activation code')}:</div>
          <ValidIcon className="valid" />
          <InvalidIcon className="invalid" />
          <DigitsMissing digitsMissing={digitsMissing} code={activationCode} />
          <div className="validation" data-rule="NOT_EMPTY">
            {translate('Please enter the activation code that you received in the email.')}
          </div>
          <div className="validation" data-rule="AT_LEAST" data-parameter={ACTIVATION_CODE_LENGTH}>
            {translate('The activation code is too short. Please enter all {int} digits.', {
              int: String(ACTIVATION_CODE_LENGTH),
            })}
          </div>
          {error && (
            <div className="validation custom" data-rule="NO_CUSTOM_ERROR">
              {error}
            </div>
          )}
        </label>
        {isExpired && (
          <div className="accountActivationExpired">
            <button
              className="gold buttonSecondary withText"
              type="button"
              onClick={handleStartAgain}
            >
              <div>{translate('Start again')}</div>
            </button>
          </div>
        )}
        <div className="actions">
          <button
            className={`green buttonFramed withText withLoadingIndicator ${isLoading ? 'loading' : ''}`}
            type="submit"
            onClick={handleSubmit}
            disabled={!!error || isLoading}
            ref={buttonRef}
            tabIndex={2}
          >
            <div>{translate('ActivateAccount')}</div>
          </button>
          <div>
            {translate('Wrong email address?')}{' '}
            <a onClick={handleStartAgain}>{translate('Change email')}</a>
          </div>
          <div>
            {translate("You didn't get a code?")}{' '}
            <a
              onClick={handleResend}
              className={resendCooldown !== undefined ? 'disabled' : ''}
            >
              {translate('Resend activation code')}
              {resendCooldown !== undefined && (
                <>
                  {' '}(
                  <Countdown
                    seconds={resendCooldown}
                    onComplete={() => setResendCooldown(undefined)}
                  />
                  )
                </>
              )}
            </a>
          </div>
        </div>
      </form>
    </div>
  );
};


// Password strength indicator
const strengthLabels: Record<number, string> = {
  0: 'weak',
  1: 'weak',
  2: 'notStrong',
  3: 'moderate',
  4: 'moderate',
  5: 'good',
  6: 'strong',
};

// Step 2: Password setup (Oe component)
interface PasswordStepProps {
  code: string;
  onClose: () => void;
  onComplete: () => void;
}

const PasswordStep = ({ code, onComplete }: PasswordStepProps) => {
  const { translate } = useI18n();
  const formRef = useRef<HTMLFormElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);

  const hasMinRequirement = password.length >= 8;

  // Calculate password strength
  let strength = 0;
  const hasLetters = /^(?=.*[a-zA-Z])/.test(password);
  const hasNumbers = /^(?=.*[0-9])/.test(password);
  const hasSpecial = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password);
  const hasMixedCase = /^(?=.*[a-z])(?=.*[A-Z])/.test(password);

  let charTypes = 0;
  if (hasLetters) charTypes++;
  if (hasNumbers) charTypes++;
  if (hasSpecial) charTypes++;

  if (hasMinRequirement) strength++;
  if (password.length >= 16) strength += 2;
  if (charTypes >= 2) strength++;
  if (charTypes === 3) strength++;
  if (hasLetters && hasMixedCase) strength++;

  const strengthLabel = strengthLabels[strength] || 'weak';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !hasMinRequirement) return;

    setIsLoading(true);
    try {
      await passwordChangeConfirm(code, password);
      onComplete();
    } catch (err: unknown) {
      const error = err as { body?: { message?: string } };
      setError(translate(error.body?.message || 'Unexpected error'));
      setIsLoading(false);
    }
  };

  return (
    <div className="stepWrapper">
      <h1>{translate('Set your password')}</h1>
      <p>
        {translate('Create a password for your account with a minimum length of {int} characters.', {
          int: '8',
        })}
      </p>
      <form ref={formRef}>
        <div className="passwordInput">
          <label className="text">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder={translate('loginPassword')}
              maxLength={64}
              onFocus={() => setError(null)}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="label">{translate('Choose a password')}:</div>
            <ValidIcon className="valid" />
            <InvalidIcon className="invalid" />
            <svg
              className="visibility"
              viewBox="0 0 16.5 11.3"
              onClick={(e) => {
                e.preventDefault();
                setShowPassword(!showPassword);
              }}
            >
              <path d="M8.2 9c.9 0 1.7-.3 2.4-1s1-1.5 1-2.4c0-.9-.3-1.7-1-2.4s-1.5-1-2.4-1c-.9 0-1.7.3-2.4 1s-1 1.5-1 2.4c0 .9.3 1.7 1 2.4s1.5 1 2.4 1zm0-1.3c-.6 0-1-.2-1.4-.6-.4-.4-.6-.9-.6-1.5s.2-1 .6-1.4c.4-.4.9-.6 1.4-.6.6 0 1 .2 1.4.6.4.4.6.9.6 1.4s-.2 1-.6 1.4c-.3.5-.8.7-1.4.7zm0 3.6c-1.8 0-3.5-.5-5-1.5C1.8 8.7.7 7.3 0 5.6c.7-1.7 1.8-3.1 3.3-4.1C4.8.5 6.5 0 8.3 0c1.8 0 3.5.5 5 1.5s2.6 2.4 3.3 4.1c-.7 1.7-1.8 3.1-3.3 4.1-1.5 1-3.3 1.6-5.1 1.6zm0-1.5c1.4 0 2.7-.4 3.9-1.1 1.2-.7 2.1-1.8 2.7-3-.6-1.2-1.5-2.3-2.7-3-1.1-.8-2.5-1.2-3.9-1.2s-2.7.4-3.9 1.1c-1.2.7-2.1 1.8-2.7 3 .6 1.2 1.5 2.3 2.7 3 1.2.8 2.6 1.2 3.9 1.2z" />
            </svg>
            {error && (
              <div className="validation custom" data-rule="NO_CUSTOM_ERROR">
                {error}
              </div>
            )}
          </label>
          <div className={`characterDisplay ${hasMinRequirement ? 'valid' : ''}`}>
            {hasMinRequirement ? (
              <svg viewBox="0 0 20 20">
                <path d="m8.6 14.6 7.1-7.1-1.4-1.4-5.6 5.7-2.9-2.9-1.4 1.4 4.2 4.3zM10 20c-1.4 0-2.7-.3-3.9-.8-1.2-.5-2.3-1.2-3.2-2.1s-1.6-2-2.1-3.2S0 11.4 0 10s.3-2.7.8-3.9S2 3.8 2.9 2.9s2-1.6 3.2-2.1S8.6 0 10 0s2.7.3 3.9.8 2.3 1.2 3.2 2.1 1.6 2 2.1 3.2c.5 1.2.8 2.5.8 3.9s-.3 2.7-.8 3.9c-.5 1.2-1.2 2.3-2.1 3.2s-2 1.6-3.2 2.1c-1.2.5-2.5.8-3.9.8z" />
              </svg>
            ) : (
              <svg viewBox="0 0 20 20">
                <path d="m6.4 15 3.6-3.6 3.6 3.6 1.4-1.4-3.6-3.6L15 6.4 13.6 5 10 8.6 6.4 5 5 6.4 8.6 10 5 13.6 6.4 15zm3.6 5c-1.4 0-2.7-.3-3.9-.8-1.2-.5-2.3-1.2-3.2-2.1s-1.6-2-2.1-3.2S0 11.4 0 10s.3-2.7.8-3.9S2 3.8 2.9 2.9s2-1.6 3.2-2.1S8.6 0 10 0s2.7.3 3.9.8 2.3 1.2 3.2 2.1 1.6 2 2.1 3.2c.5 1.2.8 2.5.8 3.9s-.3 2.7-.8 3.9c-.5 1.2-1.2 2.3-2.1 3.2s-2 1.6-3.2 2.1c-1.2.5-2.5.8-3.9.8z" />
              </svg>
            )}
            <span>{translate('{int1} - {int2} characters', { int1: '8', int2: '64' })}</span>
          </div>
          <div>
            <strong>{translate('Password strength')}</strong>
            <span className={hasMinRequirement ? strengthLabel : ''}>
              {' '}
              {translate(hasMinRequirement ? strengthLabel : 'Write a password to check its strength')}
            </span>
          </div>
          {hasMinRequirement && (
            <div className="passwordMeter">
              <div className={`bars ${strengthLabel}`}>
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={`point${i}`} className={`point ${strength >= i ? 'fulfilled' : ''}`} />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="actions">
          <button
            className={`green buttonFramed withText withLoadingIndicator ${isLoading ? 'loading' : ''}`}
            type="submit"
            onClick={handleSubmit}
            disabled={!!error || isLoading || !hasMinRequirement}
          >
            <div>{translate('Set password')}</div>
          </button>
        </div>
      </form>
    </div>
  );
};


// Step 3: Username setup (Ve component)
interface UsernameStepProps {
  onClose: () => void;
  onComplete: () => void;
}

const UsernameStep = ({ onComplete }: UsernameStepProps) => {
  const { translate, locale } = useI18n();
  const formRef = useRef<HTMLFormElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const [tagline, setTagline] = useState<string>('');

  useEffect(() => {
    generateTagline();
  }, []);

  const generateTagline = () => {
    const tag = Array.from({ length: 5 }, () =>
      String.fromCharCode(Math.floor(26 * Math.random()) + 65)
    ).join('');
    setTagline(tag);
    if (error) setError(null);
  };

  const usernameValid = username.length >= 3 && username.length <= 15;
  const taglineValid = tagline.length >= 2 && tagline.length <= 5;
  const isValid = usernameValid && taglineValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || !isValid) return;

    setIsLoading(true);
    try {
      const fullName = `${username}#${tagline}`;
      await setName(fullName);
      onComplete();
    } catch (err: unknown) {
      const error = err as { body?: { message?: string } };
      setError(translate(error.body?.message || 'Unexpected error'));
      setIsLoading(false);
    }
  };

  const clearError = () => setError(null);

  return (
    <div className="stepWrapper">
      <h1>{translate('Pick a username and tagline')}</h1>
      <p>{translate('Pick a username and tagline to create your unique Lobby Account.')}</p>
      <form ref={formRef}>
        <div className="nameWrapper">
          <label className="text">
            <input
              type="text"
              name="username"
              placeholder={translate('Username')}
              maxLength={15}
              onFocus={clearError}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <div className="label">{translate('Choose a username')}:</div>
            <ValidIcon className="valid" />
            <InvalidIcon className="invalid" />
            {error && (
              <div
                className="validation custom"
                data-rule="NO_CUSTOM_ERROR"
                data-render-into=".usernameError"
              >
                {error}
              </div>
            )}
          </label>
          <div className="tagWrapper">
            <span>#</span>
            <label className="text">
              <input
                type="text"
                name="tag"
                maxLength={5}
                onFocus={clearError}
                value={tagline}
                onChange={(e) => setTagline(e.target.value.toLocaleUpperCase(locale.locale))}
              />
              <div className="label">{translate('Choose a tagline')}:</div>
              <ValidIcon className="valid" />
              <InvalidIcon className="invalid" />
            </label>
            <button
              className="shuffleButton green buttonFramed iconButton"
              type="button"
              onClick={generateTagline}
            >
              <svg viewBox="0 0 20 19">
                <path
                  className="outline"
                  d="M11.83 8.35A2.23 2.23 0 0 0 10.05 7l-4.6-.6a2.24 2.24 0 0 0-2 .8L.51 10.74A2.2 2.2 0 0 0 .16 13l1.59 4a2.25 2.25 0 0 0 1.79 1.39l4.59.61a2.24 2.24 0 0 0 2-.79l2.94-3.58a2.23 2.23 0 0 0 .35-2.23ZM5 8.67c.6-.28 1.22-.23 1.37.1s-.21.83-.82 1.11-1.21.23-1.36-.11S4.4 9 5 8.67Zm-3.37 5.21c-.31-.52-.3-1.1 0-1.28s.82.09 1.13.62.29 1.11 0 1.29-.82-.1-1.13-.63ZM4 17.54c-.32.18-.82-.1-1.13-.63s-.29-1.1 0-1.29.82.1 1.12.63.3 1.1 0 1.29Zm1-3.15c-.31-.53-.3-1.11 0-1.29s.82.1 1.12.63.3 1.1 0 1.28-.82-.09-1.12-.62Zm2.32 3.48c-.31.18-.82-.09-1.12-.62s-.3-1.11 0-1.29.82.09 1.13.62.29 1.11 0 1.29Z"
                />
                <path
                  className="icon"
                  d="M11.83 8.35A2.23 2.23 0 0 0 10.05 7l-4.6-.6a2.24 2.24 0 0 0-2 .8L.51 10.74A2.2 2.2 0 0 0 .16 13l1.59 4a2.25 2.25 0 0 0 1.79 1.39l4.59.61a2.24 2.24 0 0 0 2-.79l2.94-3.58a2.23 2.23 0 0 0 .35-2.23ZM5 8.67c.6-.28 1.22-.23 1.37.1s-.21.83-.82 1.11-1.21.23-1.36-.11S4.4 9 5 8.67Zm-3.37 5.21c-.31-.52-.3-1.1 0-1.28s.82.09 1.13.62.29 1.11 0 1.29-.82-.1-1.13-.63ZM4 17.54c-.32.18-.82-.1-1.13-.63s-.29-1.1 0-1.29.82.1 1.12.63.3 1.1 0 1.29Zm1-3.15c-.31-.53-.3-1.11 0-1.29s.82.1 1.12.63.3 1.1 0 1.28-.82-.09-1.12-.62Zm2.32 3.48c-.31.18-.82-.09-1.12-.62s-.3-1.11 0-1.29.82.09 1.13.62.29 1.11 0 1.29Z"
                />
              </svg>
            </button>
          </div>
          <div className="shuffleMobile">
            <span>{translate('Generate new tagline')}:</span>
            <button
              className="shuffleButton green buttonFramed iconButton"
              type="button"
              onClick={generateTagline}
            >
              <svg viewBox="0 0 20 19">
                <path
                  className="outline"
                  d="M11.83 8.35A2.23 2.23 0 0 0 10.05 7l-4.6-.6a2.24 2.24 0 0 0-2 .8L.51 10.74A2.2 2.2 0 0 0 .16 13l1.59 4a2.25 2.25 0 0 0 1.79 1.39l4.59.61a2.24 2.24 0 0 0 2-.79l2.94-3.58a2.23 2.23 0 0 0 .35-2.23Z"
                />
                <path
                  className="icon"
                  d="M11.83 8.35A2.23 2.23 0 0 0 10.05 7l-4.6-.6a2.24 2.24 0 0 0-2 .8L.51 10.74A2.2 2.2 0 0 0 .16 13l1.59 4a2.25 2.25 0 0 0 1.79 1.39l4.59.61a2.24 2.24 0 0 0 2-.79l2.94-3.58a2.23 2.23 0 0 0 .35-2.23Z"
                />
              </svg>
            </button>
          </div>
          <div className="characterRules">
            <div className={`evaluation ${usernameValid ? 'fulfilled' : ''}`}>
              {usernameValid ? (
                <svg viewBox="0 0 20 20">
                  <path d="m8.6 14.6 7.1-7.1-1.4-1.4-5.6 5.7-2.9-2.9-1.4 1.4 4.2 4.3zM10 20c-1.4 0-2.7-.3-3.9-.8-1.2-.5-2.3-1.2-3.2-2.1s-1.6-2-2.1-3.2S0 11.4 0 10s.3-2.7.8-3.9S2 3.8 2.9 2.9s2-1.6 3.2-2.1S8.6 0 10 0s2.7.3 3.9.8 2.3 1.2 3.2 2.1 1.6 2 2.1 3.2c.5 1.2.8 2.5.8 3.9s-.3 2.7-.8 3.9c-.5 1.2-1.2 2.3-2.1 3.2s-2 1.6-3.2 2.1c-1.2.5-2.5.8-3.9.8z" />
                </svg>
              ) : (
                <svg viewBox="0 0 20 20">
                  <path d="m6.4 15 3.6-3.6 3.6 3.6 1.4-1.4-3.6-3.6L15 6.4 13.6 5 10 8.6 6.4 5 5 6.4 8.6 10 5 13.6 6.4 15zm3.6 5c-1.4 0-2.7-.3-3.9-.8-1.2-.5-2.3-1.2-3.2-2.1s-1.6-2-2.1-3.2S0 11.4 0 10s.3-2.7.8-3.9S2 3.8 2.9 2.9s2-1.6 3.2-2.1S8.6 0 10 0s2.7.3 3.9.8 2.3 1.2 3.2 2.1 1.6 2 2.1 3.2c.5 1.2.8 2.5.8 3.9s-.3 2.7-.8 3.9c-.5 1.2-1.2 2.3-2.1 3.2s-2 1.6-3.2 2.1c-1.2.5-2.5.8-3.9.8z" />
                </svg>
              )}
              <span>
                <span className="mobileOnly">{translate('Username')}: </span>
                {translate('{int1} - {int2} characters', { int1: '3', int2: '15' })}
              </span>
            </div>
          </div>
          <div className="characterRules">
            <div className={`evaluation ${taglineValid ? 'fulfilled' : ''}`}>
              {taglineValid ? (
                <svg viewBox="0 0 20 20">
                  <path d="m8.6 14.6 7.1-7.1-1.4-1.4-5.6 5.7-2.9-2.9-1.4 1.4 4.2 4.3zM10 20c-1.4 0-2.7-.3-3.9-.8-1.2-.5-2.3-1.2-3.2-2.1s-1.6-2-2.1-3.2S0 11.4 0 10s.3-2.7.8-3.9S2 3.8 2.9 2.9s2-1.6 3.2-2.1S8.6 0 10 0s2.7.3 3.9.8 2.3 1.2 3.2 2.1 1.6 2 2.1 3.2c.5 1.2.8 2.5.8 3.9s-.3 2.7-.8 3.9c-.5 1.2-1.2 2.3-2.1 3.2s-2 1.6-3.2 2.1c-1.2.5-2.5.8-3.9.8z" />
                </svg>
              ) : (
                <svg viewBox="0 0 20 20">
                  <path d="m6.4 15 3.6-3.6 3.6 3.6 1.4-1.4-3.6-3.6L15 6.4 13.6 5 10 8.6 6.4 5 5 6.4 8.6 10 5 13.6 6.4 15zm3.6 5c-1.4 0-2.7-.3-3.9-.8-1.2-.5-2.3-1.2-3.2-2.1s-1.6-2-2.1-3.2S0 11.4 0 10s.3-2.7.8-3.9S2 3.8 2.9 2.9s2-1.6 3.2-2.1S8.6 0 10 0s2.7.3 3.9.8 2.3 1.2 3.2 2.1 1.6 2 2.1 3.2c.5 1.2.8 2.5.8 3.9s-.3 2.7-.8 3.9c-.5 1.2-1.2 2.3-2.1 3.2s-2 1.6-3.2 2.1c-1.2.5-2.5.8-3.9.8z" />
                </svg>
              )}
              <span>
                <span className="mobileOnly">{translate('Tagline')}: </span>
                {translate('{int1} - {int2} characters', { int1: '2', int2: '5' })}
              </span>
            </div>
          </div>
        </div>
        <p>
          {username && tagline && (
            <>
              {translate('Username preview')}: <strong>{username}#{tagline}</strong>
            </>
          )}
        </p>
        {error && <p className="usernameError">{error}</p>}
        <div className="actions">
          <button
            className={`green buttonFramed withText withLoadingIndicator ${isLoading ? 'loading' : ''}`}
            type="submit"
            onClick={handleSubmit}
            disabled={!!error || isLoading || !isValid}
          >
            <div>{translate('Create Account')}</div>
          </button>
        </div>
      </form>
    </div>
  );
};


// Step 4: Success (He component)
interface SuccessStepProps {
  onClose: () => void;
  info: AccountInfo;
  context?: string;
}

const SuccessStep = ({ onClose, info }: SuccessStepProps) => {
  const { translate } = useI18n();

  return (
    <div className="stepWrapper">
      <h1>{translate('Account created successfully')}</h1>
      <p>
        {translate('Welcome to Travian Legends!')}
        <br />
        {translate('Your account has been created and you are now logged in.')}
      </p>
      {info.session?.identity?.name && (
        <p>
          <strong>{info.session.identity.name}</strong>
        </p>
      )}
      <div className="actions">
        <button
          className="green buttonFramed withText"
          type="button"
          onClick={onClose}
        >
          <div>{translate('Continue')}</div>
        </button>
      </div>
    </div>
  );
};

export default ActivationModal;
