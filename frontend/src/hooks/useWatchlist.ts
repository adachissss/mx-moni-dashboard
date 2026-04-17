import { useState, useEffect, useCallback, useRef } from 'react';
import { fetchWatchlist } from '../services/api';
import { parseApiError } from '../utils/apiError';
import type { ApiError } from '../utils/apiError';
import type { WatchlistStock } from '../types';
import { useSettings } from './useSettings';

export function useWatchlist() {
  const { settings } = useSettings();
  const [stocks, setStocks] = useState<WatchlistStock[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const s = await fetchWatchlist();
      setStocks(s);
    } catch (e: any) {
      setError(parseApiError(e, '自选股加载失败'));
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    load().finally(() => setLoading(false));
    const onRefresh = () => { load(); };
    window.addEventListener('mx:refresh', onRefresh);
    return () => window.removeEventListener('mx:refresh', onRefresh);
  }, [load]);

  useEffect(() => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
    if (settings.pollingEnabled) {
      timerRef.current = setInterval(load, settings.pollingInterval);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [settings.pollingEnabled, settings.pollingInterval, load]);

  useEffect(() => {
    if (!settings.refreshOnFocus) return;
    const onFocus = () => load();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [settings.refreshOnFocus, load]);

  return { stocks, loading, error, refresh: load };
}
