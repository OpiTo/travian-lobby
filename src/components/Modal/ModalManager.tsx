import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import LoginModal from './LoginModal';
import RegistrationModal from './RegistrationModal';
import LanguageSelectionModal from './LanguageSelectionModal';
import PasswordRecoveryModal from './PasswordRecoveryModal';
import GoldTransferModal from './GoldTransferModal';
import ActivationModal from './ActivationModal';
import ActivationSocialModal from './ActivationSocialModal';
import SetNewPasswordModal from './SetNewPasswordModal';
import ErrorSocialModal from './ErrorSocialModal';
import ReferAFriendModal from './ReferAFriendModal';
import CalendarGameworldModal from './CalendarGameworldModal';

/**
 * ModalManager component
 * Listens to URL hash changes and renders the appropriate modal.
 * Matches the original behavior where modals are triggered via URL hash.
 */
const ModalManager = () => {
  const [currentModal, setCurrentModal] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const location = useLocation();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      setCurrentModal(hash || null);
    };

    // Check initial hash and when location changes
    handleHashChange();

    // Listen for hash changes (for direct URL changes)
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [location]); // Re-run when location changes (react-router navigation)

  const closeModal = useCallback(() => {
    // Remove hash from URL
    window.history.pushState(
      '',
      document.title,
      window.location.pathname + window.location.search
    );
    setCurrentModal(null);
  }, []);

  // Get params from search params
  const code = searchParams.get('code');
  const gtlCode = searchParams.get('c');
  const calendarId = searchParams.get('calendar') || searchParams.get('server');
  const ucCode = searchParams.get('uc');

  switch (currentModal) {
    case '#loginLobby':
      return <LoginModal onClose={closeModal} />;

    case '#registration':
      return <RegistrationModal onClose={closeModal} />;

    case '#language':
    case '#languageSelection':
      return <LanguageSelectionModal onClose={closeModal} />;

    case '#passwordRecovery':
      return <PasswordRecoveryModal onClose={closeModal} />;

    case '#setNewPassword':
      if (code) {
        return <SetNewPasswordModal code={code} onClose={closeModal} />;
      }
      return null;

    case '#activation':
      if (code) {
        return <ActivationModal code={code} onClose={closeModal} />;
      }
      return null;

    case '#activationSocial':
      if (code) {
        return <ActivationSocialModal code={code} onClose={closeModal} />;
      }
      return null;

    case '#errorSocial':
      if (code) {
        return <ErrorSocialModal code={code} onClose={closeModal} />;
      }
      return null;

    case '#gtl':
      if (gtlCode) {
        return <GoldTransferModal code={gtlCode} onClose={closeModal} />;
      }
      return null;

    case '#calendarGameworldDetails':
      if (calendarId) {
        return (
          <CalendarGameworldModal
            calendarGameworldId={calendarId}
            onClose={closeModal}
          />
        );
      }
      return null;

    case '#referAFriendForwarding':
      if (ucCode) {
        return <ReferAFriendModal onClose={closeModal} />;
      }
      return null;

    default:
      return null;
  }
};

export default ModalManager;
