import { navigateToRegistration } from '../../../utils/navigation';
import { useI18n } from '../../../localization/i18n';
import { useAuth } from '../../../hooks/useAuth';

/**
 * PlayNowButton component
 * Renders the main CTA button for starting the game.
 * - When logged in: shows "To lobby" and redirects to lobby
 * - When not logged in: shows "Play Now" and opens registration modal
 * Matches original lt component behavior.
 */
const PlayNowButton = () => {
  const { translate } = useI18n();
  const { account, isAuthenticated } = useAuth();

  const isLoggedIn = isAuthenticated && account !== null;

  const handleClick = () => {
    if (isLoggedIn) {
      // Redirect to lobby
      window.location.href = window.Config?.lobby?.host || '/';
    } else {
      // Open registration modal
      navigateToRegistration();
    }
  };

  return (
    <button type="button" className="playNowCTAButton" onClick={handleClick}>
      <div className="inner">
        <svg viewBox="0 0 400 80" preserveAspectRatio="xMidYMid meet">
          <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle">
            {translate(isLoggedIn ? 'To lobby' : 'Play now')}
          </text>
        </svg>
      </div>
    </button>
  );
};

export default PlayNowButton;
