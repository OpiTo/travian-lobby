import { createContext, useContext } from 'react';
import { Locale, locales, getCurrentLocale } from '../data/locales';

// Localization types
type LocalizationKey = string;
type LocalizationStrings = Record<LocalizationKey, string>;
type InterpolationParams = Record<string, string | number>;

// Localization state
let localizationStrings: LocalizationStrings = {};
let currentLocaleData: Locale = locales['en-EN'];
let isLoaded = false;

export interface I18nContextType {
  locale: Locale;
  translate: (key: string, params?: InterpolationParams) => string;
}

export const I18nContext = createContext<I18nContextType>({
  locale: locales['en-EN'],
  translate: (key) => key,
});

/**
 * Hook to use i18n context
 */
export const useI18n = () => useContext(I18nContext);

/**
 * Load localization strings from a JSON file
 * Uses the locale's language property to load the correct file
 * @param locale - The locale object or locale key
 */
export async function loadLocalization(locale?: Locale | string): Promise<void> {
  try {
    // Determine which locale to use
    let localeData: Locale;
    if (typeof locale === 'string') {
      localeData = locales[locale] || getCurrentLocale();
    } else if (locale) {
      localeData = locale;
    } else {
      localeData = getCurrentLocale();
    }

    currentLocaleData = localeData;

    // Try to load the locale-specific file first, then fall back to language file
    const localeKey = Object.keys(locales).find(
      (key) => locales[key].name === localeData.name
    );

    let response: Response | null = null;

    // Try locale key first (e.g., en-US.json)
    if (localeKey) {
      response = await fetch(`/localisation/${localeKey}.json`);
    }

    // If not found, try the language property
    if (!response || !response.ok) {
      response = await fetch(`/localisation/${localeData.language}.json`);
    }

    // If still not found, fall back to en-US
    if (!response.ok) {
      response = await fetch('/localisation/en-US.json');
    }

    if (response.ok) {
      localizationStrings = await response.json();
      isLoaded = true;
    } else {
      throw new Error(`Failed to load localization`);
    }
  } catch (error) {
    console.error('Failed to load localization:', error);
    // Keep existing strings if load fails
  }
}

/**
 * Translate a key with optional parameter interpolation
 */
export function t(key: LocalizationKey, params?: InterpolationParams): string {
  // Get the localized value or fall back to the key itself
  let value = localizationStrings[key] ?? key;

  // If no params, return the value as-is
  if (!params) {
    return value;
  }

  // Replace all {paramName} placeholders with their values
  return Object.entries(params).reduce(
    (str, [paramKey, paramValue]) =>
      str.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramValue)),
    value
  );
}

/**
 * Get the current locale data
 */
export function getLocale(): Locale {
  return currentLocaleData;
}

/**
 * Get the current locale name (e.g., 'international', 'de', 'fr')
 */
export function getLocaleName(): string {
  return currentLocaleData.name;
}

/**
 * Check if localization has been loaded
 */
export function isLocalizationLoaded(): boolean {
  return isLoaded;
}

/**
 * Get all localization strings (for debugging or advanced use)
 */
export function getLocalizationStrings(): LocalizationStrings {
  return { ...localizationStrings };
}

/**
 * Set the current locale and reload strings
 * @param locale - The locale to set
 */
export async function setLocale(locale: Locale): Promise<void> {
  await loadLocalization(locale);
}

// Export types for external use
export type { LocalizationKey, LocalizationStrings, InterpolationParams };
