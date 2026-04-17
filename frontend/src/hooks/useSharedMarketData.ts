import { useEffect, useSyncExternalStore } from 'react';
import { fetchAccount, fetchPositions, fetchOrders } from '../services/api';
import { parseApiError } from '../utils/apiError';
import type { ApiError } from '../utils/apiError';
import type { Account, Position, Order } from '../types';
import { useSettings } from './useSettings';

export interface SharedData {
  account: Account;
  positions: Position[];
  orders: Order[];
}

interface Cache {
  data: SharedData | null;
  timestamp: number;
}

// getSnapshot 必须返回稳定引用，所以用单独的快照对象更新它
interface Snapshot {
  cache: Cache;
  loading: boolean;
  error: ApiError | null;
}

const DEFAULT_ACCOUNT: Account = {
  totalAssets: 1000000,
  availBalance: 1000000,
  totalPosValue: 0,
  posCount: 0,
  totalProfit: 0,
  profitRate: 0,
};

// ── 全局数据 store（模块单例）─────────────────────────────────
type Listener = () => void;

class MarketDataStore {
  private cache: Cache = { data: null, timestamp: 0 };
  private listeners = new Set<Listener>();
  private _loading = false;
  private _error: ApiError | null = null;
  private abortController: AbortController | null = null;
  private pollingTimer: ReturnType<typeof setInterval> | null = null;
  private settings = { pollingEnabled: false, pollingInterval: 30000, refreshOnFocus: false };

  // 稳定的快照对象，只在这里更新引用
  private _snapshot: Snapshot = {
    cache: { data: null, timestamp: 0 },
    loading: false,
    error: null,
  };

  subscribe(fn: Listener) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  // 必须返回稳定引用，否则 useSyncExternalStore 死循环
  getSnapshot() {
    return this._snapshot;
  }

  notify() {
    this.listeners.forEach(fn => fn());
  }

  private updateSnapshot() {
    this._snapshot = {
      cache: { data: this.cache.data, timestamp: this.cache.timestamp },
      loading: this._loading,
      error: this._error,
    };
    this.notify();
  }

  updateSettings(next: { pollingEnabled: boolean; pollingInterval: number; refreshOnFocus: boolean }) {
    this.settings = next;
    this.setupPolling();
  }

  isFresh(): boolean {
    if (!this.cache.data) return false;
    return Date.now() - this.cache.timestamp < this.settings.pollingInterval;
  }

  async load(force = false) {
    if (!force && this.isFresh()) return;
    this.abortController?.abort();
    this.abortController = new AbortController();
    this._loading = true;

    try {
      const account = await fetchAccount();
      const positions = await fetchPositions();
      const orders = await fetchOrders();

      this.cache = { data: { account, positions, orders }, timestamp: Date.now() };
      this._error = null;
    } catch (e: any) {
      if (e.name !== 'CanceledError' && e.name !== 'AbortError') {
        this._error = parseApiError(e, '数据加载失败');
      }
    } finally {
      this._loading = false;
      this.updateSnapshot();
    }
  }

  forceRefresh() {
    this.cache = { data: this.cache.data, timestamp: 0 };
    this.load(true);
  }

  private setupPolling() {
    if (this.pollingTimer) {
      clearInterval(this.pollingTimer);
      this.pollingTimer = null;
    }
    if (this.settings.pollingEnabled) {
      this.pollingTimer = setInterval(() => this.load(false), this.settings.pollingInterval);
    }
  }

  init() {
    this.load(false);
    this.setupPolling();

    const onInvalidate = () => this.load(true);
    window.addEventListener('mx:invalidate', onInvalidate);

    const onFocus = () => { if (this.settings.refreshOnFocus) this.load(false); };
    window.addEventListener('focus', onFocus);

    return () => {
      window.removeEventListener('mx:invalidate', onInvalidate);
      window.removeEventListener('focus', onFocus);
      this.abortController?.abort();
      if (this.pollingTimer) clearInterval(this.pollingTimer);
    };
  }
}

export const store = new MarketDataStore();

let storeStarted = false;
export function ensureStoreStarted() {
  if (!storeStarted) {
    storeStarted = true;
    store.init();
  }
}

// ── 共享 hook ────────────────────────────────────────────────
function useSharedMarketDataRaw() {
  const { settings } = useSettings();
  ensureStoreStarted();

  // 唯一订阅点，所有模块共享同一份数据
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useSyncExternalStore(store.subscribe.bind(store), store.getSnapshot.bind(store), store.getSnapshot.bind(store));

  // settings 变化 → 更新 store 轮询参数
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    store.updateSettings(settings);
  }, [settings.pollingEnabled, settings.pollingInterval, settings.refreshOnFocus]);

  const snap = store.getSnapshot();
  return {
    cache: snap.cache,
    loading: snap.loading,
    error: snap.error,
    refresh: () => store.forceRefresh(),
  };
}

// ── 三个订阅端 hooks ─────────────────────────────────────────
export function useAccount() {
  const { cache, loading, error, refresh } = useSharedMarketDataRaw();
  return { data: cache.data?.account ?? DEFAULT_ACCOUNT, loading, error, refresh };
}

export function usePositions() {
  const { cache, loading, error, refresh } = useSharedMarketDataRaw();
  return { data: cache.data?.positions ?? [], loading, error, refresh };
}

export function useOrders() {
  const { cache, loading, error, refresh } = useSharedMarketDataRaw();
  return { data: cache.data?.orders ?? [], loading, error, refresh };
}

// 外部调用：下单成功后通知所有组件强制刷新
export function invalidateMarketData() {
  window.dispatchEvent(new Event('mx:invalidate'));
}
