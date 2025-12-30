/**
 * Authentication Service - High-level auth operations
 * Combines Identity and Lobby services for complete auth flow
 */

import * as Identity from './identity';
import * as Lobby from './lobby';
import { ApiError } from './api';

export interface Account {
  guid: string;
  name: string;
}

export interface LoginCredentials {
  login: string;
  password: string;
}

export interface RegisterData {
  email: string;
  newsletter?: boolean;
  locale?: string;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  needsActivation?: boolean;
  activationCode?: string;
  account?: Account;
}

export interface ActivationData {
  code: string;
  password?: string;
  name?: string;
}

/**
 * Complete login flow:
 * 1. Authenticate with Identity provider (get auth code)
 * 2. Exchange code for session with Lobby
 * 3. Fetch account info
 */
export async function login(credentials: LoginCredentials): Promise<AuthResult> {
  try {
    const authResponse = await Identity.authenticateLogin(
      credentials.login,
      credentials.password
    );

    await Lobby.authorize(authResponse.code, authResponse.code_verifier);
    const account = await Lobby.getSession();

    return { success: true, account: account ?? undefined };
  } catch (error) {
    const apiError = error as ApiError;

    if (apiError.body?.error === 'identity_needs_activation') {
      return {
        success: false,
        needsActivation: true,
        activationCode: apiError.body.code,
        error: 'Account needs activation',
      };
    }

    if (apiError.body?.error === 'invalid_credentials') {
      return {
        success: false,
        error: 'Invalid email/username or password',
      };
    }

    return {
      success: false,
      error: apiError.body?.message || apiError.message || 'Login failed',
    };
  }
}

/**
 * Register new account
 * After registration, user receives activation email
 * If identity_needs_activation is returned, redirect to activation
 */
export async function register(data: RegisterData): Promise<AuthResult> {
  try {
    await Identity.register(data.email, {
      newsletter: data.newsletter,
      locale: data.locale,
    });

    return { success: true };
  } catch (error) {
    const apiError = error as ApiError;

    // Handle identity_needs_activation - redirect to activation modal
    if (apiError.body?.error === 'identity_needs_activation') {
      return {
        success: false,
        needsActivation: true,
        activationCode: apiError.body.code,
        error: 'identity_needs_activation',
      };
    }

    if (apiError.status === 409 || apiError.body?.error === 'identity_exists') {
      return {
        success: false,
        error: 'identity_exists',
      };
    }

    return {
      success: false,
      error: apiError.body?.message || apiError.message || 'Registration failed',
    };
  }
}

/**
 * Activate account (from email link or during login)
 */
export async function activate(data: ActivationData): Promise<AuthResult> {
  try {
    const response = await Identity.activate(data.code, {
      password: data.password,
      name: data.name,
    });

    await Lobby.authorize(response.code, response.code_verifier);

    return { success: true };
  } catch (error) {
    const apiError = error as ApiError;
    return {
      success: false,
      error: apiError.body?.message || apiError.message || 'Activation failed',
    };
  }
}

/**
 * Resend activation email
 */
export async function resendActivation(activationCode: string): Promise<{ success: boolean; cooldownUntil?: Date; error?: string }> {
  try {
    const cooldownUntil = await Identity.resendActivationEmail(activationCode);
    return { success: true, cooldownUntil };
  } catch (error) {
    const apiError = error as ApiError;
    return {
      success: false,
      error: apiError.body?.message || apiError.message || 'Failed to resend activation email',
    };
  }
}

/**
 * Request password recovery email
 */
export async function requestPasswordRecovery(login: string, locale: string = 'en-US'): Promise<AuthResult> {
  try {
    await Lobby.passwordChangeRequest(login, locale);
    return { success: true };
  } catch {
    // Always return success to prevent email enumeration
    return { success: true };
  }
}

/**
 * Confirm password change (with code from email)
 */
export async function confirmPasswordChange(code: string, newPassword: string): Promise<AuthResult> {
  try {
    await Lobby.passwordChangeConfirm(code, newPassword);
    return { success: true };
  } catch (error) {
    const apiError = error as ApiError;
    return {
      success: false,
      error: apiError.body?.message || apiError.message || 'Password change failed',
    };
  }
}

/**
 * Logout
 */
export async function logout(): Promise<void> {
  try {
    await Lobby.logout();
  } catch {
    // Ignore logout errors
  }
}

/**
 * Get current session/account
 */
export async function getSession(): Promise<Account | null> {
  return Lobby.getSession();
}

/**
 * Social login (Google, Facebook, Apple)
 */
export async function socialLogin(
  provider: 'google' | 'facebook' | 'apple',
  providerData: Record<string, unknown>
): Promise<AuthResult> {
  try {
    const authResponse = await Identity.authenticateProvider(provider, providerData);
    await Lobby.authorize(authResponse.code, authResponse.code_verifier);
    return { success: true };
  } catch (error) {
    const apiError = error as ApiError;
    return {
      success: false,
      error: apiError.body?.message || apiError.message || 'Social login failed',
    };
  }
}

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
};

export const sanitizeInput = (input: string): string => {
  return input.trim().slice(0, 255);
};
