import { useState, useEffect, useCallback } from 'react';

export interface Settings {
  // 数据刷新
  pollingEnabled: boolean;   // 是否开启自动轮询
  pollingInterval: number;    // 轮询间隔(ms)，默认60000(1分钟)
  // 账户
  refreshOnFocus: boolean;   // 窗口聚焦时刷新
}

const DEFAULT_SETTINGS: Settings = {
  pollingEnabled: false,
  pollingInterval: 60000,
  refreshOnFocus: false,
};

const STORAGE_KEY = 'mx_settings';

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_SETTINGS;
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  const updateSettings = useCallback((patch: Partial<Settings>) => {
    setSettings(prev => {
      const next = { ...prev, ...patch };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { settings, updateSettings };
}
