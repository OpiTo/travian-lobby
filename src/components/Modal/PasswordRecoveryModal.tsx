import { useState, useRef, useEffect } from 'react';
import Modal from './Modal';
import { Button } from '../common';
import { ValidIcon, InvalidIcon, ChevronDownIcon } from './Icons';
import { useI18n } from '../../localization/i18n';
import { useNavigateWithParams } from '../../hooks';
import FormValidator from '../../utils/FormValidator';
import { passwordChangeRequest } from '../../services/lobby';

interface PasswordRecoveryModalProps {
  onClose: () => void;
}

/**
 * Password Recovery Modal component (Ta component in original)
 * Uses Lobby API: PUT /api/identity/password
 * Structure matches original exactly with back button, no close button
 */
const PasswordRecoveryModal = ({ onClose }: PasswordRecoveryModalProps) => {
  const { translate, locale } = useI18n();
  const navigate = useNavigateWithParams();
  const formRef = useRef<HTMLFormElement>(null);
  const validatorRef = useRef(new FormValidator(formRef));

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [successEmail, setSuccessEmail] = useState<string | undefined>();

  useEffect(() => {
    validatorRef.current?.attach();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    validatorRef.current?.validateForm();
    if (isLoading || !validatorRef.current?.formValid) return;

    const formData = new FormData(formRef.current || undefined);
    setIsLoading(true);

    try {
      const email = formData.get('email') as string;
      await passwordChangeRequest(email, locale.locale);
      setSuccessEmail(email);
    } catch (err: unknown) {
      const error = err as { body?: { message?: string } };
      setError(translate(error.body?.message || 'Unexpected Error'));
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(undefined);
  };

  return (
    <Modal id="passwordRecovery" onClose={onClose} closeButton={false}>
      {/* Back button at top - matches original */}
      <Button
        className="back"
        secondaryButton
        href="#loginLobby"
      >
        <ChevronDownIcon />
        <span>{translate('Back to Login')}</span>
      </Button>

      <h1>{translate('Password Recovery')}</h1>

      {/* Form state - not submitted yet */}
      {!successEmail && (
        <>
          <p>
            {translate(
              'Enter the email address associated with your Legends Lobby account. We will send you instructions on how to reset your password.'
            )}
          </p>
          <form ref={formRef}>
            <label className={`text ${error ? 'withCustomValidationRenderElement' : ''}`}>
              <input
                type="text"
                name="email"
                placeholder={translate('Enter your email address')}
                onFocus={clearError}
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
                  className="validation custom"
                  data-rule={FormValidator.NO_CUSTOM_ERROR}
                >
                  {error}
                </div>
              )}
            </label>
            <div className="actions">
              <Button
                type="submit"
                onClick={handleSubmit}
                onSubmit={handleSubmit}
                disabledAttribute={isLoading}
                withLoadingIndicator
                isLoading={isLoading}
              >
                {translate('Recover password')}
              </Button>
            </div>
          </form>
        </>
      )}

      {/* Success state */}
      {successEmail && (
        <div className="success">
          <p>
            {translate(
              'If a Lobby Account exists for the provided email address, we have sent you instructions to reset your password to the email:'
            )}{' '}
            <strong>{successEmail}</strong>
          </p>
          <p>
            {translate('Once you have recovered your password, you can log in again.')}
          </p>
          <div className="actions">
            <Button
              type="button"
              onClick={() => navigate('#loginLobby')}
            >
              {translate('Login')}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default PasswordRecoveryModal;
