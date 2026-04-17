import { FastifyInstance } from 'fastify';
import { getSelectedAccountId, getAccountKey } from '../services/accountStore.js';
import { fetchBalance, fetchPositions, fetchOrders, fetchWatchlist, fetchIndices } from '../services/eastmoney.js';

export async function marketRoutes(fastify: FastifyInstance) {
  async function getKey() {
    const id = getSelectedAccountId();
    if (!id) throw { statusCode: 401, message: 'no account selected' };
    const key = getAccountKey(id);
    if (!key) throw { statusCode: 401, message: 'account key not found' };
    return key;
  }

  fastify.get('/market/balance', async () => {
    const key = await getKey();
    return fetchBalance(key);
  });

  fastify.get('/market/positions', async () => {
    const key = await getKey();
    return fetchPositions(key);
  });

  fastify.get('/market/orders', async (req) => {
    const key = await getKey();
    const status = Number((req.query as any).status ?? 0);
    return fetchOrders(key, status);
  });

  fastify.get('/market/watchlist', async () => {
    const key = await getKey();
    return fetchWatchlist(key);
  });

  fastify.get('/market/indices', async () => {
    const key = await getKey();
    return fetchIndices(key, ['上证指数', '深证成指', '创业板指']);
  });
}
