import { useState, useEffect, useRef, FormEvent } from 'react';
import Modal from './Modal';
import { useI18n } from '../../localization/i18n';
import { ValidIcon, InvalidIcon } from './Icons';
import { activate } from '../../services/identity';
import { authorize } from '../../services/lobby';

interface ActivationSocialModalProps {
  code: string;
  onClose: () => void;
}

/**
 * Activation Social Modal (Ke component in original)
 * Handles account activation for social login accounts
 */
const ActivationSocialModal = ({ code, onClose }: ActivationSocialModalProps) => {
  const { translate } = useI18n();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [step, setStep] = useState<'form' | 'success'>('form');

  const nameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const name = nameRef.current?.value;

    if (!name || isLoading) return;

    setIsLoading(true);
    setError(undefined);

    try {
      const result = await activate(code, { name });
      // Exchange code for session
      await authorize(result.code, result.code_verifier);
      setStep('success');
    } catch (err: unknown) {
      const error = err as { body?: { message?: string; error?: string } };
      setError(translate(error.body?.message || error.body?.error || 'Unexpected Error'));
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => setError(undefined);

  if (step === 'success') {
    return (
      <Modal id="activationSocial" onClose={onClose} closeButton>
        <h1>{translate('Account activated')}</h1>
        <p>{translate('Your account has been successfully activated. You can now play!')}</p>
        <div className="actions">
          <button
            className="green buttonFramed withText"
            type="button"
            onClick={onClose}
          >
            <div>{translate('Continue')}</div>
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal id="activationSocial" onClose={onClose} closeButton>
      <h1>{translate('Complete your registration')}</h1>
      <form onSubmit={handleSubmit}>
        <p>{translate('Please set your avatar name to complete registration.')}</p>

        <label className={`text ${error ? 'withCustomValidationRenderElement' : ''}`}>
          <input
            type="text"
            name="name"
            ref={nameRef}
            placeholder={translate('Avatarname')}
            onFocus={clearError}
            onChange={clearError}
          />
          <div className="label">{translate('Avatarname')}:</div>
          <ValidIcon className="valid" />
          <InvalidIcon className="invalid" />
          <div className="validation" data-rule="NOT_EMPTY">
            {translate(
              'Please enter your desired avatarname. It has to be between {min} and {max} characters long.',
              { min: '3', max: '15' }
            )}
          </div>
          <div className="validation" data-rule="AT_LEAST" data-parameter="3">
            {translate(
              'We are sorry but your desired avatarname is too short. It has to be at least {min} characters long.',
              { min: '3' }
            )}
          </div>
          {error && (
            <div className="validation custom" data-rule="NO_CUSTOM_ERROR">
              {error}
            </div>
          )}
        </label>

        <div className="actions">
          <button
            className={`green buttonFramed withText withLoadingIndicator ${isLoading ? 'loading' : ''}`}
            type="submit"
            disabled={isLoading}
          >
            <div>{translate('Complete registration')}</div>
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ActivationSocialModal;
