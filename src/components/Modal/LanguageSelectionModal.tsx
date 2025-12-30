import { useState, useRef } from 'react';
import Modal from './Modal';
import { getSortedLocales, Locale } from '../../data/locales';
import { useI18n } from '../../localization/i18n';

interface LanguageSelectionModalProps {
  onClose: () => void;
}

/**
 * Language Selection Modal component (sa component in original)
 * Renders the language selection form with search and radio buttons.
 * Structure: Modal#languageSelection > h1 + section
 */
const LanguageSelectionModal = ({ onClose }: LanguageSelectionModalProps) => {
  const { locale: currentLocale, translate } = useI18n();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocales, setFilteredLocales] = useState<Locale[]>([currentLocale]);
  const searchTimeoutRef = useRef<number | undefined>(undefined);
  const allLocales = getSortedLocales();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = window.setTimeout(() => {
      clearTimeout(searchTimeoutRef.current);
      setSearchQuery(target.value);
      filterLocales(target.value);
    }, 12);
  };

  const filterLocales = (query: string) => {
    if (query === '') {
      setFilteredLocales([currentLocale]);
    } else {
      const lowerQuery = query.toLowerCase();
      const filtered = allLocales.filter(
        (locale) =>
          locale.name.indexOf(lowerQuery) !== -1 ||
          locale.langEnglish.toLowerCase().indexOf(lowerQuery) !== -1 ||
          locale.langNative.toLowerCase().indexOf(lowerQuery) !== -1 ||
          locale.countryEnglish.toLowerCase().indexOf(lowerQuery) !== -1 ||
          locale.countryNative.toLowerCase().indexOf(lowerQuery) !== -1
      );
      setFilteredLocales(filtered);
    }
  };

  const handleLocaleChange = async (locale: Locale) => {
    // Change URL to new locale (same as original behavior)
    const pathParts = window.location.pathname.split('/');
    pathParts[1] = locale.name;
    window.location.href = pathParts.join('/');
  };

  return (
    <Modal id="languageSelection" closeButton onClose={onClose}>
      <h1>{translate('Language selection')}</h1>
      <section>
        <label className="text">
          <input
            type="text"
            name="lang"
            onChange={handleSearchChange}
            defaultValue={searchQuery}
          />
          <div className="label">
            {translate('Search for a language or country')}
          </div>
        </label>

        {filteredLocales.length > 0 ? (
          <div className="languages recommended">
            {filteredLocales.map((locale) => (
              <LanguageRadioButton
                key={locale.name}
                locale={locale}
                type="recommended"
                currentLocale={currentLocale}
                onChange={handleLocaleChange}
              />
            ))}
          </div>
        ) : (
          <div className="noMatch">
            {translate(
              'No language matches your search. Are you sure you typed it correctly?'
            )}
          </div>
        )}

        <div className="languages others">
          {allLocales.map((locale) => (
            <LanguageRadioButton
              key={locale.name}
              locale={locale}
              type="others"
              currentLocale={currentLocale}
              onChange={handleLocaleChange}
            />
          ))}
        </div>
      </section>
    </Modal>
  );
};

interface LanguageRadioButtonProps {
  locale: Locale;
  type: 'recommended' | 'others';
  currentLocale: Locale;
  onChange: (locale: Locale) => void;
}

/**
 * Language radio button (m function in original)
 * Structure: label.radio.language > input[type=radio] + svg.radio + div.label
 */
const LanguageRadioButton = ({
  locale,
  type,
  currentLocale,
  onChange,
}: LanguageRadioButtonProps) => {
  return (
    <label className="radio language">
      <input
        type="radio"
        defaultChecked={currentLocale.name === locale.name}
        name={type}
        onChange={() => onChange(locale)}
      />
      <RadioIcon className="radio" />
      <div className="label">
        <FlagIcon name={locale.flag} />
        {locale.langNative}
        {locale.countryNative && (
          <span className="addition">({locale.countryNative})</span>
        )}
      </div>
    </label>
  );
};

/**
 * Radio icon (ta component in original)
 * viewBox: 0 0 20 20
 */
const RadioIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 20 20">
    <path d="M10,0A10,10,0,1,0,20,10,10,10,0,0,0,10,0Z" />
    <circle cx="10" cy="10" r="5" />
  </svg>
);

/**
 * Flag icon (E component in original)
 * Structure: i.flag.[name]
 */
const FlagIcon = ({ name, title }: { name: string; title?: string }) => (
  <i className={`flag ${name}`} title={title} />
);

export default LanguageSelectionModal;
