/**
 * URL utilities
 * Matches original URL generation functions
 */

/**
 * Get Terms & Conditions URL (de function in original)
 * @param language - Language code (e.g., 'en-US')
 * @returns Terms URL
 */
export const getTermsUrl = (language: string): string => {
  const lang = language.split('-')[0];
  return `https://agb.traviangames.com/terms-${lang}.pdf`;
};

/**
 * Get Right of Withdrawal URL (he function in original)
 * @param language - Language code (e.g., 'en-US')
 * @returns Withdrawal URL
 */
export const getWithdrawalUrl = (language: string): string => {
  const lang = language.split('-')[0];
  return `https://agb.traviangames.com/terms-${lang}.pdf#row`;
};

/**
 * Get Privacy Policy URL (ue function in original)
 * @param language - Language code (e.g., 'en-US')
 * @returns Privacy URL
 */
export const getPrivacyUrl = (language: string): string => {
  const lang = language.split('-')[0];
  return `https://agb.traviangames.com/privacy-${lang}-TL.pdf`;
};

/**
 * Get Gold Transfer Help URL (ge function in original)
 * @param language - Language code (e.g., 'en-US')
 * @returns Gold transfer help URL
 */
export const getGoldTransferHelpUrl = (language: string): string => {
  const lang = language.split('-')[0];
  return `https://support.travian.com/${lang}/support/solutions/articles/7000060364-gold-transfer`;
};

/**
 * Get Lobby URL (Ia function in original)
 * @param locale - Locale object with name property
 * @returns Lobby URL
 */
export const getLobbyUrl = (locale: { name: string }): string => {
  return `${window.Config?.lobby?.host || ''}/${locale.name}`;
};
