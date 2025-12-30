import { Link, useParams } from 'react-router-dom';
import HamburgerMenu from './HamburgerMenu';
import LanguageSelector from './LanguageSelector';
import Logo from './Logo';
import LoginButton from './LoginButton';
import { useI18n } from '../../localization';

/**
 * Header component
 */
const Header = () => {
  const { locale } = useI18n();
  const { localeName } = useParams<{ localeName: string }>();
  const currentLocale = localeName || locale.name;

  return (
    <header>
      <div className="headerContainerStart">
        <HamburgerMenu />
        <LanguageSelector />
      </div>
      <Link to={`/${currentLocale}`} aria-label="Go to home">
        <Logo />
      </Link>
      <div className="headerContainerEnd">
        <LoginButton />
      </div>
    </header>
  );
};

export default Header;
