/**
 * Crypto utilities
 * Matches original n module functions
 */

/**
 * Generate random string (IY function in original)
 * @param length - Length of the string to generate
 * @returns Random string
 */
export const generateRandomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => chars[byte % chars.length]).join('');
};

/**
 * Base64 URL encode (lu function in original)
 * @param buffer - ArrayBuffer to encode
 * @returns Base64 URL encoded string
 */
export const base64UrlEncode = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

/**
 * Base64 URL decode (z5 function in original)
 * @param str - Base64 URL encoded string
 * @returns Uint8Array
 */
export const base64UrlDecode = (str: string): Uint8Array => {
  // Add padding if needed
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
};

/**
 * Generate PKCE code verifier and challenge (r function in original)
 * @returns Object with code_verifier, code_challenge, and code_challenge_method
 */
export const generatePKCE = async (): Promise<{
  code_verifier: string;
  code_challenge: string;
  code_challenge_method: string;
}> => {
  const code_verifier = generateRandomString(32);
  const encoder = new TextEncoder();
  const data = encoder.encode(code_verifier);
  const hash = await crypto.subtle.digest('SHA-256', data);

  return {
    code_verifier,
    code_challenge: base64UrlEncode(hash),
    code_challenge_method: 'S256',
  };
};
