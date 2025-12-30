import { useState, useEffect } from 'react';
import { getNews, NewsItem } from '../services/lobby';

interface UseNewsResult {
  news: NewsItem | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to fetch the latest news item for homepage preview
 */
export function useLatestNews(): UseNewsResult {
  const [news, setNews] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchNews() {
      try {
        setLoading(true);
        const newsItems = await getNews(undefined, 1);
        if (!cancelled && newsItems.length > 0) {
          setNews(newsItems[0]);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to fetch news'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchNews();

    return () => {
      cancelled = true;
    };
  }, []);

  return { news, loading, error };
}
