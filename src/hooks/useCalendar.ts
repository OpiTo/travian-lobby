import { useState, useEffect } from 'react';
import { getCalendar, CalendarEntry } from '../services/lobby';

interface UseCalendarResult {
  nextGameworld: CalendarEntry | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to fetch the next upcoming gameworld from calendar
 */
export function useNextGameworld(): UseCalendarResult {
  const [nextGameworld, setNextGameworld] = useState<CalendarEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchCalendar() {
      try {
        setLoading(true);
        const calendar = await getCalendar();
        if (!cancelled) {
          // Find the next upcoming gameworld (start time > now)
          const now = Date.now() / 1000;
          const upcoming = calendar.find((entry) => entry.start > now);
          setNextGameworld(upcoming || null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to fetch calendar'));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchCalendar();

    return () => {
      cancelled = true;
    };
  }, []);

  return { nextGameworld, loading, error };
}
