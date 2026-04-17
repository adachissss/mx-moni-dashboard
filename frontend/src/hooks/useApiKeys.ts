import { useState, useEffect, useCallback } from 'react';
import { fetchAccounts, fetchSelectedAccount, selectAccount as apiSelectAccount, addAccount as apiAddAccount, deleteAccount as apiDeleteAccount } from '../services/api';
import { invalidateMarketData } from './useSharedMarketData';

export interface ApiKey {
  id?: number;
  name: string;
  key?: string; // 后端不返回真实 key
}

const PLACEHOLDER: ApiKey = { id: undefined, name: '请添加账户' };

export function useApiKeys() {
  const [keys, setKeys] = useState<ApiKey[]>([PLACEHOLDER]);
  const [current, setCurrent] = useState<ApiKey>(PLACEHOLDER);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [accounts, selected] = await Promise.all([
        fetchAccounts(),
        fetchSelectedAccount(),
      ]);
      const list: ApiKey[] = accounts.length ? accounts : [PLACEHOLDER];
      setKeys(list);
      const sel = list.find(a => a.id === selected.id);
      setCurrent(sel ?? list[0] ?? PLACEHOLDER);
    } catch {
      setKeys([PLACEHOLDER]);
      setCurrent(PLACEHOLDER);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const selectKey = useCallback(async (k: ApiKey) => {
    if (!k.id) return;
    await apiSelectAccount(k.id);
    setCurrent(k);
    invalidateMarketData();
  }, []);

  const addKey = useCallback(async (name: string, key: string) => {
    const acc = await apiAddAccount(name, key);
    const newKey: ApiKey = { id: acc.id, name: acc.name };
    setKeys(prev => [...prev, newKey]);
    setCurrent(newKey);
    invalidateMarketData();
    return newKey;
  }, []);

  const removeKey = useCallback(async (id: number) => {
    await apiDeleteAccount(id);
    setKeys(prev => {
      const next = prev.filter(k => k.id !== id);
      return next.length ? next : [PLACEHOLDER];
    });
    if (current.id === id) {
      const remaining = keys.find(k => k.id !== id);
      setCurrent(remaining ?? PLACEHOLDER);
      invalidateMarketData();
    }
  }, [current.id, keys]);

  return { keys, current, selectKey, addKey, removeKey, reload: load, loading };
}
