import axios from 'axios';

const BASE_URL = 'https://mkapi2.dfcfs.com/finskillshub';

function emClient(apiKey: string) {
  return axios.create({
    baseURL: BASE_URL,
    headers: { apikey: apiKey, 'Content-Type': 'application/json' },
    timeout: 30000,
  });
}

export async function fetchBalance(apiKey: string) {
  const res = await emClient(apiKey).post('/api/claw/mockTrading/balance', { moneyUnit: 1 });
  return res.data;
}

export async function fetchPositions(apiKey: string) {
  const res = await emClient(apiKey).post('/api/claw/mockTrading/positions', { moneyUnit: 1 });
  return res.data;
}

// 持仓字段解析：value=分(÷1000->元), profit=厘(÷100->元), costPrice=厘(costPriceDec=3->÷10000->元), price=分(priceDec=2->÷100->元)

export async function fetchOrders(apiKey: string, status = 0) {
  const res = await emClient(apiKey).post('/api/claw/mockTrading/orders', {
    fltOrderDrt: 0,
    fltOrderStatus: status,
    moneyUnit: 1,
  });
  return res.data;
}

export async function fetchWatchlist(apiKey: string) {
  const res = await emClient(apiKey).post('/api/claw/self-select/get', {});
  return res.data;
}

export async function fetchIndices(apiKey: string, names: string[]) {
  const results = [];
  for (const name of names) {
    const res = await emClient(apiKey).post('/api/claw/query', { toolQuery: `${name}最新行情` });
    results.push(res.data);
  }
  return results;
}
