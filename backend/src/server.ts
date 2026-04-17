import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { CONFIG } from './config.js';
import { initDb } from './db/sqlite.js';
import { accountsRoutes } from './routes/accounts.js';
import { marketRoutes } from './routes/market.js';

async function start() {
  const fastify = Fastify({ logger: true });

  await fastify.register(cors, CONFIG.cors);

  await initDb();

  fastify.register(accountsRoutes, { prefix: '/api' });
  fastify.register(marketRoutes, { prefix: '/api' });

  fastify.get('/health', async () => ({ ok: true }));

  await fastify.listen({ port: CONFIG.port });
  console.log(`backend listening on http://localhost:${CONFIG.port}`);
}

start();
