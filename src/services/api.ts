/**
 * API Service - Base HTTP client
 * Uses PKCE (Proof Key for Code Exchange) for OAuth2 authentication
 */

import { config } from '../config/config';

/**
 * Generate random string for PKCE code_verifier
 */
export const generateRandomString = (length: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => chars[byte % chars.length]).join('');
};

/**
 * Base64 URL encode
 */
export const base64UrlEncode = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

/**
 * Generate PKCE challenge pair
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
  const code_challenge = base64UrlEncode(hash);
  return { code_verifier, code_challenge, code_challenge_method: 'S256' };
};

export interface ApiError extends Error {
  body?: {
    error?: string;
    code?: string;
    message?: string;
  };
  status?: number;
}

/**
 * Make HTTP request
 */
export async function request<T>(
  url: URL | string,
  options: RequestInit = {},
  body?: Record<string, unknown> | null
): Promise<T> {
  const requestUrl = typeof url === 'string' ? url : url.toString();

  const requestOptions: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  if (body !== undefined && body !== null) {
    requestOptions.body = JSON.stringify(body);
  }

  const response = await fetch(requestUrl, requestOptions);

  const contentType = response.headers.get('content-type');
  let responseData: T | undefined;

  if (contentType?.includes('application/json')) {
    responseData = await response.json();
  }

  if (!response.ok) {
    const error: ApiError = new Error(
      (responseData as Record<string, unknown>)?.message as string ||
      (responseData as Record<string, unknown>)?.error as string ||
      `Request failed with status ${response.status}`
    );
    error.body = responseData as ApiError['body'];
    error.status = response.status;
    throw error;
  }

  return responseData as T;
}

/**
 * Make request to lobby API (with credentials)
 */
export async function lobbyRequest<T>(
  endpoint: string,
  body: Record<string, unknown> | null = null,
  options: RequestInit = { method: 'POST' }
): Promise<T> {
  return request<T>(
    new URL(endpoint, config.lobby.host),
    { ...options, credentials: 'include' },
    body
  );
}

/**
 * Make request to identity API
 */
export async function identityRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  body?: Record<string, unknown> | null
): Promise<T> {
  const url = new URL(endpoint, config.identity.host);
  return request<T>(url, options, body);
}
