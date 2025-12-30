import Modal from './Modal';
import { useI18n } from '../../localization/i18n';

interface ReferAFriendModalProps {
  onClose: () => void;
}

/**
 * Refer A Friend Forwarding Modal (Ra component in original)
 * Shows when user is being forwarded via refer-a-friend link
 */
const ReferAFriendModal = ({ onClose }: ReferAFriendModalProps) => {
  const { translate } = useI18n();

  return (
    <Modal id="referAFriendForwarding" onClose={onClose} closeButton>
      <h1>{translate('Refer a Friend')}</h1>
      <p>
        {translate(
          'You have been invited by a friend! Register now and both of you will receive bonus rewards.'
        )}
      </p>
      <div className="actions">
        <button
          className="green buttonFramed withText"
          type="button"
          onClick={() => {
            onClose();
            window.location.hash = '#registration';
          }}
        >
          <div>{translate('Register now')}</div>
        </button>
        <button
          className="gold buttonSecondary withText"
          type="button"
          onClick={() => {
            onClose();
            window.location.hash = '#loginLobby';
          }}
        >
          <div>{translate('Already have an account? Login')}</div>
        </button>
      </div>
    </Modal>
  );
};

export default ReferAFriendModal;
