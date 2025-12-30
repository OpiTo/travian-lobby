import { useI18n } from '../../localization/i18n';
import { useParams } from 'react-router-dom';

/**
 * Footer component
 */
const Footer = () => {
  const { translate, locale } = useI18n();
  const { localeName } = useParams<{ localeName: string }>();
  const currentLocale = localeName || locale.name;
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="separator">
        <svg className="start" viewBox="0 0 21 17">
          <path fill="#cba467" d="m14.012 8.496 3.5-3.5 3.5 3.5-3.5 3.5z"></path>
          <path
            fill="#7c694b"
            d="M11.5 17 3 8.5 11.5 0 20 8.5 11.5 17ZM3.75 8.5l7.75 7.75 7.75-7.75L11.5.75 3.75 8.5Z"
          ></path>
          <path fill="#7c694b" d="M8.18 16.68 0 8.5 8.18.32l.35.36L.71 8.5l7.82 7.82-.35.36z"></path>
        </svg>
        <svg className="end" viewBox="0 0 21 17">
          <path fill="#cba467" d="m14.012 8.496 3.5-3.5 3.5 3.5-3.5 3.5z"></path>
          <path
            fill="#7c694b"
            d="M11.5 17 3 8.5 11.5 0 20 8.5 11.5 17ZM3.75 8.5l7.75 7.75 7.75-7.75L11.5.75 3.75 8.5Z"
          ></path>
          <path fill="#7c694b" d="M8.18 16.68 0 8.5 8.18.32l.35.36L.71 8.5l7.82 7.82-.35.36z"></path>
        </svg>
      </div>
      <a
        className="travianGamesLogo"
        href="https://www.traviangames.com/"
        title="https://www.traviangames.com/"
        rel="noopener noreferrer"
        target="_blank"
      ></a>
      <nav>
        <a href="https://agb.traviangames.com/terms-en.pdf" target="_blank" rel="noopener noreferrer">{translate('Terms & Conditions')}</a>
        <a href="https://agb.traviangames.com/terms-en.pdf#row" target="_blank" rel="noopener noreferrer">{translate('Right of Withdrawal')}</a>
        <a href="https://agb.traviangames.com/privacy-en-TL.pdf" target="_blank" rel="noopener noreferrer">{translate('Privacy Policy')}</a>
        <a href={`/${currentLocale}/gamerules`}>{translate('Game Rules')}</a>
        <a href={`/${currentLocale}/imprint`}>{translate('Imprint')}</a>
      </nav>
      <div className="copyright">© 2004 - {currentYear} Travian Games GmbH. All rights reserved.</div>
    </footer>
  );
};

export default Footer;
