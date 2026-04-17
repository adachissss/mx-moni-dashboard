// 账户数据
export interface Account {
  totalAssets: number;
  availBalance: number;
  totalPosValue: number;
  posCount: number;
  totalProfit: number;
  profitRate: number;   // 累计盈亏率(%)，直接用 totalProfit/initMoney 计算
  accName?: string;
  accId?: string;
  initMoney?: number;
}

// 持仓
export interface Position {
  stockCode: string;
  stockName: string;
  quantity: number;
  avgCost: number;
  currentPrice: number;
  profit: number;
  profitRate: number;
}

// 委托
export interface Order {
  orderId: string;
  stockCode: string;
  stockName: string;
  direction: 'buy' | 'sell';
  price: number;
  quantity: number;
  filledQty: number;
  status: 'pending' | 'partial' | 'filled' | 'cancelled' | 'rejected';
  orderTime: string;
}

// 自选股
export interface WatchlistStock {
  code: string;
  name: string;
  price: number;
  change: number;
  changeRate: number;
  volume: number;
  amount: number;
  high: number;
  low: number;
}

// 大盘指数
export interface IndexQuote {
  code: string;
  name: string;
  price: number;
  change: number;
  changeRate: number;
}
