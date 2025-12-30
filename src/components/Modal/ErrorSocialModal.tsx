import Modal from './Modal';
import { useI18n } from '../../localization/i18n';

interface ErrorSocialModalProps {
  code: string;
  onClose: () => void;
}

/**
 * Error Social Modal (ea component in original)
 * Shows error for social login issues (e.g., no email permission)
 */
const ErrorSocialModal = ({ code, onClose }: ErrorSocialModalProps) => {
  const { translate } = useI18n();

  const getErrorMessage = () => {
    switch (code) {
      case 'mailPermission':
        return translate(
          'We could not retrieve your email address from the social provider. Please grant email permission or register with email.'
        );
      default:
        return translate('An error occurred during social login. Please try again or use email registration.');
    }
  };

  return (
    <Modal id="errorSocial" onClose={onClose} closeButton>
      <h1>{translate('Login Error')}</h1>
      <p>{getErrorMessage()}</p>
      <div className="actions">
        <button
          className="green buttonFramed withText"
          type="button"
          onClick={() => {
            onClose();
            window.location.hash = '#registration';
          }}
        >
          <div>{translate('Register with email')}</div>
        </button>
        <button
          className="gold buttonSecondary withText"
          type="button"
          onClick={onClose}
        >
          <div>{translate('Close')}</div>
        </button>
      </div>
    </Modal>
  );
};

export default ErrorSocialModal;
