import axios from 'axios';
import type { Account, Position, Order, WatchlistStock, IndexQuote } from '../types';

const localClient = axios.create({
  baseURL: '/api',
  timeout: 30000,
});

// 账户资金
export async function fetchAccount(): Promise<Account> {
  const res = await localClient.get('/market/balance');
  const d = res.data.data;
  // moneyUnit=1 返回元，直接使用
  const totalAssets = d.totalAssets ?? 0;
  const availBalance = d.availBalance ?? 0;
  const totalPosValue = d.totalPosValue ?? 0;
  const initMoney = d.initMoney ?? 1000000;
  const totalProfit = totalAssets - initMoney;
  return {
    totalAssets,
    availBalance,
    totalPosValue,
    posCount: Array.isArray(d.posList) ? d.posList.length : (d.posCount ?? 0),
    totalProfit,
    profitRate: initMoney > 0 ? (totalProfit / initMoney) * 100 : 0,
    accName: d.accName,
    accId: d.accID,
    initMoney,
  };
}

// 持仓
export async function fetchPositions(): Promise<Position[]> {
  const res = await localClient.get('/market/positions');
  const posList: any[] = res.data.data?.posList ?? [];
  return posList.map((p) => {
    const quantity = p.count ?? 0;
    const avgCost = (p.costPrice ?? 0) / 1000;
    const currentPrice = (p.price ?? 0) / 100;
    const profit = p.profit ?? 0;
    const profitRate = p.profitPct ?? 0;
    return {
      stockCode: p.secCode ?? '',
      stockName: p.secName ?? '',
      quantity,
      avgCost,
      currentPrice,
      profit,
      profitRate,
    };
  });
}

// 委托
export async function fetchOrders(): Promise<Order[]> {
  const res = await localClient.get('/market/orders');
  const orders: any[] = res.data.data?.orders ?? [];
  return orders.map((o) => ({
    orderId: o.id ?? '',
    stockCode: o.secCode ?? '',
    stockName: o.secName ?? '',
    direction: o.drt === 1 ? 'buy' : 'sell',
    price: (o.price ?? 0) / 100,
    quantity: o.count ?? 0,
    filledQty: o.tradeCount ?? 0,
    status: statusMap(o.status, o.dbStatus),
    orderTime: o.time ? new Date(o.time * 1000).toLocaleString('zh-CN') : '',
  }));
}

function statusMap(s: any, dbStatus: any): Order['status'] {
  if (s === undefined || s === null) return 'pending';
  if (String(s) === '9') {
    if (dbStatus === 203 || dbStatus === 3) return 'cancelled';
    return 'rejected';
  }
  const m: Record<string, Order['status']> = {
    '0': 'pending',
    '1': 'pending',
    '2': 'partial',
    '4': 'filled',
  };
  return m[String(s)] ?? 'pending';
}

// 自选股
export async function fetchWatchlist(): Promise<WatchlistStock[]> {
  const res = await localClient.get('/market/watchlist');
  const dataList: any[] = res.data?.data?.allResults?.result?.dataList ?? [];
  return dataList.map((d) => ({
    code: d.SECURITY_CODE ?? '',
    name: d.SECURITY_SHORT_NAME ?? '',
    price: parseFloat(d.NEWEST_PRICE) || 0,
    change: parseFloat(d.PCHG) || 0,
    changeRate: parseFloat(d.CHG) || 0,
    volume: 0,
    amount: 0,
    high: 0,
    low: 0,
  }));
}

// 大盘指数
export async function fetchIndices(): Promise<IndexQuote[]> {
  const res = await localClient.get('/market/indices');
  const results: IndexQuote[] = [];
  const names = ['上证指数', '深证成指', '创业板指'];

  for (let i = 0; i < names.length; i++) {
    const r = res.data[i];
    if (!r) continue;
    if (r.code === 113 || r.status === 113) continue;
    const tableList = r.data?.searchDataResultDTO?.dataTableDTOList ?? [];
    if (tableList.length > 0) {
      const rawTable = tableList[0].rawTable ?? {};
      const values = Object.values(rawTable)[0] as string[] ?? [];
      const price = parseFloat(values[0]) || 0;
      const table = tableList[0].table ?? {};
      const tableValues = Object.values(table)[0] as string[] ?? [];
      const changeRate = parseFloat(tableValues[0]?.replace('%', '').replace('涨', '').replace('跌', '')) || 0;
      results.push({ code: names[i], name: names[i], price, change: 0, changeRate });
    }
  }
  return results;
}

// === 账户管理 ===

export async function fetchAccounts() {
  const res = await localClient.get('/accounts');
  return res.data;
}

export async function fetchSelectedAccount() {
  const res = await localClient.get('/accounts/selected');
  return res.data;
}

export async function selectAccount(id: number) {
  await localClient.post('/accounts/selected', { id });
}

export async function addAccount(name: string, apiKey: string) {
  const res = await localClient.post('/accounts', { name, apiKey });
  return res.data;
}

export async function deleteAccount(id: number) {
  await localClient.delete(`/accounts/${id}`);
}
