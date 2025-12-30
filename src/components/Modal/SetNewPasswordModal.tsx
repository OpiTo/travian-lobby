import { useState, useRef, FormEvent } from 'react';
import Modal from './Modal';
import { useI18n } from '../../localization/i18n';
import { ValidIcon, InvalidIcon, VisibilityIcon } from './Icons';
import { passwordChangeConfirm } from '../../services/lobby';

interface SetNewPasswordModalProps {
  code: string;
  onClose: () => void;
}

/**
 * Set New Password Modal (ka component in original)
 * Handles password reset confirmation with code from email
 */
const SetNewPasswordModal = ({ code, onClose }: SetNewPasswordModalProps) => {
  const { translate } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [showPassword, setShowPassword] = useState(false);

  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const password = passwordRef.current?.value;
    const confirmPassword = confirmPasswordRef.current?.value;

    if (!password || !confirmPassword || isLoading) return;

    if (password !== confirmPassword) {
      setError(translate('Passwords do not match'));
      return;
    }

    if (password.length < 8) {
      setError(translate('Password must be at least 8 characters long'));
      return;
    }

    setIsLoading(true);
    setError(undefined);

    try {
      await passwordChangeConfirm(code, password);
      setStep('success');
    } catch (err: unknown) {
      const error = err as { body?: { message?: string; error?: string } };
      setError(translate(error.body?.message || error.body?.error || 'Unexpected Error'));
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(undefined);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  if (step === 'success') {
    return (
      <Modal id="setNewPassword" onClose={onClose} closeButton>
        <h1>{translate('Password changed')}</h1>
        <p>{translate('Your password has been successfully changed. You can now log in with your new password.')}</p>
        <div className="actions">
          <button
            className="green buttonFramed withText"
            type="button"
            onClick={() => {
              onClose();
              window.location.hash = '#loginLobby';
            }}
          >
            <div>{translate('Login')}</div>
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal id="setNewPassword" onClose={onClose} closeButton>
      <h1>{translate('Set new password')}</h1>
      <form onSubmit={handleSubmit}>
        <p>{translate('Please enter your new password.')}</p>

        <label className="text password">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            ref={passwordRef}
            placeholder={translate('New password')}
            onFocus={clearError}
            onChange={clearError}
          />
          <div className="label">{translate('New password')}:</div>
          <ValidIcon className="valid" />
          <InvalidIcon className="invalid" />
          <VisibilityIcon className="visibility" onClick={togglePasswordVisibility} />
          <div className="validation" data-rule="AT_LEAST" data-parameter="8">
            {translate('Password must be at least {min} characters long', { min: '8' })}
          </div>
        </label>

        <label className="text password">
          <input
            type={showPassword ? 'text' : 'password'}
            name="confirmPassword"
            ref={confirmPasswordRef}
            placeholder={translate('Confirm password')}
            onFocus={clearError}
            onChange={clearError}
          />
          <div className="label">{translate('Confirm password')}:</div>
          <ValidIcon className="valid" />
          <InvalidIcon className="invalid" />
        </label>

        {error && (
          <div className="error-message">{error}</div>
        )}

        <div className="actions">
          <button
            className={`green buttonFramed withText withLoadingIndicator ${isLoading ? 'loading' : ''}`}
            type="submit"
            disabled={isLoading}
          >
            <div>{translate('Set password')}</div>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default SetNewPasswordModal;
