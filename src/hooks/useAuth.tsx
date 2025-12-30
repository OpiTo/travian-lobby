/**
 * Authentication Hook
 * Provides auth state and methods to components
 */

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import {
  Account,
  login as authLogin,
  register as authRegister,
  logout as authLogout,
  getSession,
  LoginCredentials,
  RegisterData,
  AuthResult,
} from '../services/auth';

interface AuthState {
  account: Account | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  register: (data: RegisterData) => Promise<AuthResult>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
  initialAccount?: Account | null;
}

export function AuthProvider({ children, initialAccount }: AuthProviderProps) {
  const [state, setState] = useState<AuthState>({
    account: initialAccount ?? null,
    isAuthenticated: !!initialAccount,
    isLoading: !initialAccount, // Only loading if no initial account provided
  });

  // Check session on mount if no initial account
  useEffect(() => {
    if (initialAccount !== undefined) return; // Skip if initial account was provided

    const checkSession = async () => {
      try {
        const account = await getSession();
        setState({
          account,
          isAuthenticated: !!account,
          isLoading: false,
        });
      } catch {
        setState({
          account: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    checkSession();
  }, [initialAccount]);

  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResult> => {
    setState(prev => ({ ...prev, isLoading: true }));

    const result = await authLogin(credentials);

    if (result.success && result.account) {
      setState({
        account: result.account,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }

    return result;
  }, []);

  const register = useCallback(async (data: RegisterData): Promise<AuthResult> => {
    setState(prev => ({ ...prev, isLoading: true }));

    const result = await authRegister(data);

    setState(prev => ({ ...prev, isLoading: false }));

    return result;
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    await authLogout();
    setState({
      account: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const refreshSession = useCallback(async (): Promise<void> => {
    const account = await getSession();
    setState({
      account,
      isAuthenticated: !!account,
      isLoading: false,
    });
  }, []);

  const value: AuthContextValue = {
    ...state,
    login,
    register,
    logout,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Re-export Account type
export type { Account };
