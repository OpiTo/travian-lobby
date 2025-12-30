import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useI18n } from '../../localization/i18n';

const HamburgerMenu = () => {
  const { translate, locale } = useI18n();
  const navigate = useNavigate();
  const { localeName } = useParams<{ localeName: string }>();
  const [isOpen, setIsOpen] = useState(false);

  // Use current locale from URL or fallback to locale from context
  const currentLocale = localeName || locale.name;

  const toggleMenu = () => {
    setIsOpen(prev => !prev);
  };

  const handleNavigate = (path: string) => {
    setIsOpen(false);
    navigate(`/${currentLocale}${path}`);
  };

  return (
    <nav className="pageMenu">
      <a 
        className={`openClosePageMenu ${isOpen ? 'opened' : 'closed'}`}
        onClick={toggleMenu}
      >
        <svg viewBox="0 0 30 18">
          <g className="outline">
            <path
              className="start"
              d="M0 3.16V.84C0 .37.34 0 .76 0h17.49c.42 0 .76.38.76.84v2.31c0 .47-.34.84-.76.84H.76c-.42 0-.76-.38-.76-.84Z"
            ></path>
            <path
              className="center"
              d="M30 7.84v2.31c0 .47-.34.84-.75.84H.75c-.41 0-.75-.38-.75-.84V7.84C0 7.37.34 7 .75 7h28.5c.41 0 .75.38.75.84Z"
            ></path>
            <path
              className="center"
              d="M30 7.84v2.31c0 .47-.34.84-.75.84H.75c-.41 0-.75-.38-.75-.84V7.84C0 7.37.34 7 .75 7h28.5c.41 0 .75.38.75.84Z"
            ></path>
            <path
              className="end"
              d="M25 14.84v2.31c0 .47-.34.84-.75.84H.75c-.42 0-.75-.38-.75-.84v-2.31c0-.47.34-.84.75-.84h23.49c.42 0 .75.38.75.84Z"
            ></path>
          </g>
          <g className="icon">
            <path
              className="start"
              d="M0 3.16V.84C0 .37.34 0 .76 0h17.49c.42 0 .76.38.76.84v2.31c0 .47-.34.84-.76.84H.76c-.42 0-.76-.38-.76-.84Z"
            ></path>
            <path
              className="center"
              d="M30 7.84v2.31c0 .47-.34.84-.75.84H.75c-.41 0-.75-.38-.75-.84V7.84C0 7.37.34 7 .75 7h28.5c.41 0 .75.38.75.84Z"
            ></path>
            <path
              className="center"
              d="M30 7.84v2.31c0 .47-.34.84-.75.84H.75c-.41 0-.75-.38-.75-.84V7.84C0 7.37.34 7 .75 7h28.5c.41 0 .75.38.75.84Z"
            ></path>
            <path
              className="end"
              d="M25 14.84v2.31c0 .47-.34.84-.75.84H.75c-.42 0-.75-.38-.75-.84v-2.31c0-.47.34-.84.75-.84h23.49c.42 0 .75.38.75.84Z"
            ></path>
          </g>
        </svg>
      </a>
      {isOpen && (
        <div className="menu">
          <a onClick={() => handleNavigate('')} className="home">
            <svg viewBox="0 0 20 18"><path d="M2 18V7l8-6 8 6v11h-6v-6H8v6H2Z"></path></svg>
            <span>{translate('Home')}</span>
            <ChevronIcon />
          </a>
          <a onClick={() => handleNavigate('/news')} className="news">
            <svg viewBox="0 0 20 18">
              <path d="M2 18c-.55 0-1.02-.2-1.41-.59C.2 17.04 0 16.53 0 16V0l1.67 1.67L3.32 0l1.67 1.67L6.67 0l1.65 1.67L10 0l1.68 1.67L13.33 0l1.68 1.67L16.68 0l1.65 1.67L20.01 0v16c0 .55-.2 1.02-.59 1.41-.37.38-.88.59-1.41.59H2Zm0-2h7v-6H2v6Zm9 0h7v-2h-7v2Zm0-4h7v-2h-7v2ZM2 8h16V5H2v3Z"></path>
            </svg>
            <span>{translate('News & Updates')}</span>
            <ChevronIcon />
          </a>
          <a onClick={() => handleNavigate('/calendar')} className="calendar">
            <svg viewBox="0 0 18 20">
              <path d="M1.96 20c-.538 0-1-.196-1.384-.587A1.945 1.945 0 0 1 0 18V4c0-.55.192-1.02.576-1.413A1.87 1.87 0 0 1 1.961 2h.98V0h1.961v2h7.843V0h1.96v2h.981c.54 0 1.001.196 1.385.587.384.392.576.863.576 1.413v14c0 .55-.192 1.02-.576 1.413a1.87 1.87 0 0 1-1.385.587H1.961Zm0-2h13.726V8H1.961v10Z"></path>
            </svg>
            <span>{translate('Gameworld Calendar')}</span>
            <ChevronIcon />
          </a>
          <a onClick={() => handleNavigate('/tournament')} className="tournament">
            <svg viewBox="0 0 20 20">
              <path d="M4.44 20v-2.22h4.45v-3.44c-.89-.19-1.72-.59-2.43-1.15a4.922 4.922 0 0 1-1.57-2.12C3.5 10.9 2.34 10.3 1.4 9.25S0 6.98 0 5.57V4.46c0-.61.22-1.13.65-1.57.41-.43.98-.66 1.57-.65h2.22V0h11.11v2.22h2.22c.59 0 1.16.23 1.57.65.43.43.65.96.65 1.57v1.11c0 1.41-.47 2.64-1.4 3.68s-2.1 1.65-3.49 1.82c-.32.84-.86 1.57-1.57 2.12-.71.56-1.54.96-2.43 1.15v3.44h4.44v2.22H4.44Z"></path>
            </svg>
            <span>{translate('Tournament')}</span>
            <ChevronIcon />
          </a>
          <a className="dataConsent" onClick={() => setIsOpen(false)}>
            <svg viewBox="0 0 20 20">
              <path d="M9 15h2V9H9v6Zm1-8c.28 0 .52-.1.71-.29.19-.19.29-.43.29-.71s-.1-.52-.29-.71S10.28 5 10 5s-.52.1-.71.29S9 5.72 9 6s.1.52.29.71c.19.19.43.29.71.29Zm0 13c-1.38 0-2.68-.26-3.9-.79-1.22-.52-2.28-1.24-3.18-2.14-.9-.9-1.61-1.96-2.14-3.18-.52-1.22-.79-2.52-.79-3.9s.26-2.68.79-3.9c.53-1.22 1.24-2.28 2.14-3.18.9-.9 1.96-1.61 3.18-2.14C7.32.25 8.62-.02 10-.02s2.68.26 3.9.79c1.22.53 2.27 1.24 3.18 2.14.9.9 1.61 1.96 2.14 3.18.52 1.22.79 2.52.79 3.9s-.26 2.68-.79 3.9-1.24 2.27-2.14 3.18c-.9.9-1.96 1.61-3.18 2.14S11.38 20 10 20Z"></path>
            </svg>
            <span>{translate('Data consent')}</span>
            <ChevronIcon />
          </a>
        </div>
      )}
    </nav>
  );
};

const ChevronIcon = () => (
  <svg viewBox="0 0 8 14">
    <path d="M.3 13.7a1 1 0 0 1 0-1.42L5.07 7 .29 1.71A1 1 0 0 1 1.71.3l5.5 6a1 1 0 0 1 0 1.42l-5.5 6a1 1 0 0 1-1.41 0Z"></path>
  </svg>
);

export default HamburgerMenu;
