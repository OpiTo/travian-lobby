import { ReactNode, useState, useEffect, useMemo } from 'react';
import { I18nContext, loadLocalization, t } from './i18n';
import { Locale, getCurrentLocale } from '../data/locales';

interface I18nProviderProps {
  children: ReactNode;
}

/**
 * Update HTML element attributes for RTL/LTR support
 * Sets lang, dir, and CSS custom properties for reading direction
 */
const updateHtmlDirection = (locale: Locale) => {
  const html = document.documentElement;
  const isRtl = locale.direction === 'rtl';

  // Set lang attribute (e.g., "en-US", "ar-AE")
  html.setAttribute('lang', locale.locale);

  // Set dir attribute
  html.setAttribute('dir', locale.direction);

  // Set CSS custom properties for reading direction
  html.style.setProperty('--readingDirection', locale.direction);
  html.style.setProperty('--readingDirectionFrom', isRtl ? 'right' : 'left');
  html.style.setProperty('--readingDirectionTo', isRtl ? 'left' : 'right');
  html.style.setProperty('--scaleXFactor', isRtl ? '-1' : '1');
};

/**
 * I18n Provider component
 * Provides locale and translate function to all children via context
 */
export const I18nProvider = ({ children }: I18nProviderProps) => {
  const [locale, setLocale] = useState<Locale>(getCurrentLocale());
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initLocalization = async () => {
      const currentLocale = getCurrentLocale();
      setLocale(currentLocale);
      await loadLocalization(currentLocale);

      // Update HTML attributes for RTL/LTR support
      updateHtmlDirection(currentLocale);

      setIsReady(true);
    };

    initLocalization();
  }, []);

  const contextValue = useMemo(
    () => ({
      locale,
      translate: t,
    }),
    [locale]
  );

  // Don't render children until localization is loaded
  if (!isReady) {
    return null;
  }

  return (
    <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>
  );
};

export default I18nProvider;
