/**
 * Identity Service - Authentication with Identity Provider
 * 
 * Endpoints:
 * - POST /provider/login/register - Register new account
 * - POST /provider/login - Login with email/password
 * - POST /provider/{provider} - Social login (google, facebook, apple)
 * - POST /identity/activate - Activate account
 * - POST /identity/activate/resend - Resend activation email
 */

import { config } from '../config/config';
import { identityRequest, generatePKCE, ApiError } from './api';

export interface RegisterPayload {
  email: string;
  newsletter?: boolean;
  locale?: string;
  captchaToken?: string;
}

export interface LoginPayload {
  login: string;
  password: string;
  code_challenge: string;
  code_challenge_method: string;
}

export interface ActivatePayload {
  code_challenge: string;
  code_challenge_method: string;
  password?: string;
  name?: string;
  captchaToken?: string;
  acceptTermsAndConditions?: boolean;
  activationCode?: string;
  attestation?: { Captcha?: string };
}

export interface AuthCodeResponse {
  code: string;
  code_verifier: string;
  context?: string;
}

export interface ActivationResponse {
  code: string;
  code_verifier: string;
  context?: string;
}

export interface ResendResponse {
  cooldown: number;
}

/**
 * Register new account
 */
export async function register(
  email: string,
  options: Partial<RegisterPayload> & {
    attestation?: { Captcha?: string };
    options?: { locale?: string; newsletter?: boolean };
    context?: { server?: string; ad?: string; uc?: string };
  } = {}
): Promise<void> {
  const url = `/provider/login/register?client_id=${config.identity.client_id}`;
  await identityRequest(url, { method: 'POST' }, { ...options, email });
}

/**
 * Authenticate with login (email/username) and password
 * Returns auth code + code_verifier for token exchange
 */
export async function authenticateLogin(
  login: string,
  password: string,
  activationOptions: Partial<ActivatePayload> = {}
): Promise<AuthCodeResponse> {
  try {
    const { code_verifier, code_challenge, code_challenge_method } = await generatePKCE();

    const url = `/provider/login?client_id=${config.identity.client_id}`;
    const response = await identityRequest<{ code: string }>(
      url,
      { method: 'POST' },
      { login, password, code_challenge, code_challenge_method }
    );

    return { code: response.code, code_verifier };
  } catch (error) {
    const apiError = error as ApiError;
    if (apiError.body?.error === 'identity_needs_activation' && apiError.body?.code) {
      return activate(apiError.body.code, activationOptions);
    }
    throw error;
  }
}

/**
 * Activate account (after registration or when login requires activation)
 */
export async function activate(
  activationCode: string,
  options: Partial<ActivatePayload> = {}
): Promise<ActivationResponse> {
  const { code_verifier, code_challenge, code_challenge_method } = await generatePKCE();

  const url = `/identity/activate?client_id=${config.identity.client_id}&code=${activationCode}`;
  const response = await identityRequest<{ code: string; context?: string }>(
    url,
    { method: 'POST' },
    { ...options, code_challenge, code_challenge_method }
  );

  return { code: response.code, code_verifier, context: response.context };
}

/**
 * Resend activation email
 * Returns cooldown timestamp (when next resend is allowed)
 */
export async function resendActivationEmail(activationCode: string): Promise<Date> {
  const url = `/identity/activate/resend?client_id=${config.identity.client_id}&code=${activationCode}`;
  const response = await identityRequest<ResendResponse>(url, { method: 'POST' });
  return new Date(response.cooldown * 1000);
}

/**
 * Authenticate with social provider (Google, Facebook, Apple)
 */
export async function authenticateProvider(
  provider: 'google' | 'facebook' | 'apple',
  providerData: Record<string, unknown>
): Promise<AuthCodeResponse> {
  const { code_verifier, code_challenge, code_challenge_method } = await generatePKCE();

  const url = `/provider/${provider}?client_id=${config.identity.client_id}`;
  const response = await identityRequest<{ code: string }>(
    url,
    { method: 'POST' },
    { ...providerData, code_challenge, code_challenge_method }
  );

  return { code: response.code, code_verifier };
}
