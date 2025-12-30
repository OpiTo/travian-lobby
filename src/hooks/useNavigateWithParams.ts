import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Preserved query params (x array in original)
 * These params are preserved when navigating between pages
 */
const PRESERVED_PARAMS = ['server', 'uc', 'ad'];

/**
 * Custom navigate hook that preserves certain query params (p function in original)
 * Matches the original behavior exactly.
 */
export const useNavigateWithParams = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (to: string, options?: { replace?: boolean; state?: unknown }) => {
    let url: URL;

    // Parse the target URL based on its format
    switch (to[0]) {
      case '?':
      case '#':
        url = new URL(location.pathname + to, window.location.origin);
        break;
      case '.':
      case '/':
        url = new URL(to, window.location.origin);
        break;
      default:
        url = new URL(to);
    }

    const targetParams = new URLSearchParams(url.search);
    const hash = url.hash;
    const currentParams = new URLSearchParams(location.search);

    // Preserve specified params from current URL if not already in target
    for (const [key, value] of currentParams.entries()) {
      if (PRESERVED_PARAMS.includes(key) && !targetParams.has(key)) {
        targetParams.set(key, value);
      }
    }

    const searchString = targetParams.toString();

    navigate(
      {
        pathname: url.pathname,
        search: searchString,
        hash: hash,
      },
      options
    );
  };
};

export default useNavigateWithParams;
