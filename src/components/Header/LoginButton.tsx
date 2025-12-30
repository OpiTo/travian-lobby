import { useState, useCallback } from 'react';
import { navigateToLogin } from '../../utils/navigation';
import { useI18n } from '../../localization/i18n';
import { useAuth } from '../../hooks/useAuth';

/**
 * LoginButton component
 * Shows login button when not authenticated, or account menu when logged in.
 * Matches original lobby structure exactly.
 */
const LoginButton = () => {
  const { translate } = useI18n();
  const { account, isAuthenticated, isLoading, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const handleLogout = useCallback(async () => {
    setIsMenuOpen(false);
    await logout();
    // Reload page after logout like original
    window.location.href = window.location.href;
  }, [logout]);

  // Show loading state
  if (isLoading) {
    return (
      <button className="gold buttonSecondary login withText" type="button" disabled>
        <div>
          <span>...</span>
        </div>
      </button>
    );
  }

  // Show account menu when logged in (matches original structure)
  if (isAuthenticated && account) {
    const lobbyUrl = window.Config?.lobby?.host || '/';

    return (
      <nav className="accountMenu">
        <button
          className={`gold buttonSecondary openCloseAccountMenu ${isMenuOpen ? 'opened' : 'closed'} withText`}
          type="button"
          onClick={toggleMenu}
        >
          <div>
            <AccountIcon />
            <span>{account.name}</span>
            <ChevronIcon />
          </div>
        </button>
        {isMenuOpen && (
          <div className="menu">
            <div className="account">
              <span>{account.name}</span>
            </div>
            <a
              className="accountSettings"
              href={`${lobbyUrl}/account#settings`}
              onClick={() => setIsMenuOpen(false)}
            >
              <SettingsIcon />
              <span>{translate('Account settings')}</span>
              <ChevronIcon />
            </a>
            <a className="lobby" href={lobbyUrl}>
              <LobbyIcon />
              <span>{translate('To lobby')}</span>
              <ChevronIcon />
            </a>
            <a className="logout" onClick={handleLogout}>
              <LogoutIcon />
              <span>{translate('Logout')}</span>
              <ChevronIcon />
            </a>
          </div>
        )}
      </nav>
    );
  }

  // Show login button when not authenticated
  return (
    <button
      className="gold buttonSecondary login withText"
      type="button"
      onClick={navigateToLogin}
    >
      <div>
        <LoginIcon />
        <span>{translate('Login')}</span>
      </div>
    </button>
  );
};

/**
 * Account/User icon SVG (qa in original)
 */
const AccountIcon = () => (
  <svg viewBox="0 0 18 18">
    <path d="M9 9c-1.24 0-2.3-.44-3.18-1.32C4.94 6.8 4.5 5.74 4.5 4.5s.44-2.3 1.32-3.18C6.7.44 7.76 0 9 0s2.3.44 3.18 1.32c.88.88 1.32 1.94 1.32 3.18s-.44 2.3-1.32 3.18C11.3 8.56 10.24 9 9 9ZM.02 18c.08-1.24-.29-3.84.49-4.9.33-.53.76-.94 1.3-1.22 2.28-1.14 4.67-1.74 7.18-1.74 2.52 0 4.91.6 7.18 1.74.54.28.98.69 1.3 1.22.79 1.05.41 3.68.49 4.9H.02Zm2.25-2.24h13.47c0-.62.12-1.53-.56-1.85a13.4 13.4 0 0 0-12.35 0c-.68.31-.56 1.24-.56 1.85ZM9 6.75c.62 0 1.15-.22 1.59-.66.44-.44.66-.97.66-1.59s-.22-1.15-.66-1.59c-.44-.44-.97-.66-1.59-.66s-1.15.22-1.59.66c-.44.44-.66.97-.66 1.59s.22 1.15.66 1.59c.44.44.97.66 1.59.66Z" />
  </svg>
);

/**
 * Chevron/Arrow icon SVG (La in original)
 */
const ChevronIcon = () => (
  <svg className="chevron" viewBox="0 0 12 7.4">
    <path d="M10.6 0L6 4.6 1.4 0 0 1.4l6 6 6-6L10.6 0z" />
  </svg>
);

/**
 * Settings/Gear icon SVG (Pa in original)
 */
const SettingsIcon = () => (
  <svg viewBox="0 0 20 20">
    <path d="m7.8 20-.4-3.2c-.2-.1-.5-.2-.7-.4-.2-.1-.5-.3-.7-.4l-3 1.3-2.2-3.8 2.6-2c0-.2-.1-.5-.1-.7v-.7c0-.2 0-.5.1-.7l-2.6-2 2.2-3.8 3 1.3c.2-.2.4-.3.7-.4.2-.1.5-.3.7-.4L7.8 0h4.4l.4 3.2c.2.1.5.2.7.4.2.1.5.3.7.4l3-1.3 2.2 3.8-2.6 2c0 .2.1.5.1.7v.7c0 .2 0 .5-.1.7l2.6 2-2.2 3.8-3-1.3c-.2.2-.4.3-.7.4-.2.1-.5.3-.7.4l-.4 3.2H7.8Zm2.2-6c1.1 0 2-.4 2.8-1.2.8-.8 1.2-1.7 1.2-2.8s-.4-2-1.2-2.8C12 6.4 11.1 6 10 6s-2 .4-2.8 1.2C6.4 8 6 8.9 6 10s.4 2 1.2 2.8c.8.8 1.7 1.2 2.8 1.2Z" />
  </svg>
);

/**
 * Lobby/Home icon SVG (Ya in original)
 */
const LobbyIcon = () => (
  <svg viewBox="0 0 20 18">
    <path d="M2 18V6l8-6 8 6v12h-6v-7H8v7H2Z" />
  </svg>
);

/**
 * Login icon SVG (za in original)
 */
const LoginIcon = () => (
  <svg className="login" viewBox="0 0 18 18">
    <path d="M9 18v-2h7V2H9V0h7c.55 0 1.02.2 1.41.59.39.39.59.86.59 1.41v14c0 .55-.2 1.02-.59 1.41-.37.38-.88.59-1.41.59H9Zm-2-4-1.38-1.45L8.17 10H0V8h8.18L5.63 5.45 7.01 4l5 5-5 5Z" />
  </svg>
);

/**
 * Logout icon SVG (Va in original)
 */
const LogoutIcon = () => (
  <svg viewBox="0 0 18 18">
    <path d="M2 18c-.55 0-1.02-.2-1.41-.59C.2 17.02 0 16.55 0 16V2C0 1.45.2.98.59.59.98.2 1.45 0 2 0h7v2H2v14h7v2H2Zm12-4-1.38-1.45L15.17 10H6V8h9.18l-2.55-2.55L14.01 4l5 5-5 5Z" />
  </svg>
);

export default LoginButton;
