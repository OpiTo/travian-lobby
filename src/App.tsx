import { useEffect } from 'react';
import AppRouter from './router';
import { initConfig } from './config/config';
import { I18nProvider } from './localization/I18nProvider';
import { AuthProvider } from './hooks/useAuth';

/**
 * App component
 * Root component that assembles the lobby page.
 * Initializes configuration on mount.
 * Wraps everything in providers for auth and localization.
 * Uses react-router for page navigation matching original lobby structure.
 */
function App() {
  useEffect(() => {
    // Initialize configuration on window.Config
    initConfig();
  }, []);

  return (
    <AuthProvider>
      <I18nProvider>
        <AppRouter />
      </I18nProvider>
    </AuthProvider>
  );
}

export default App;
