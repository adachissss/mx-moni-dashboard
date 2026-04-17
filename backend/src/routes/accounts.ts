import { FastifyInstance } from 'fastify';
import { listAccounts, getSelectedAccountId, setSelectedAccount, addAccount, removeAccount } from '../services/accountStore.js';

export async function accountsRoutes(fastify: FastifyInstance) {
  fastify.get('/accounts', async () => {
    return listAccounts();
  });

  fastify.get('/accounts/selected', async () => {
    const id = getSelectedAccountId();
    return { id };
  });

  fastify.post('/accounts/selected', async (req) => {
    const { id } = req.body as any;
    setSelectedAccount(id);
    return { ok: true };
  });

  fastify.post('/accounts', async (req) => {
    const { name, apiKey } = req.body as any;
    if (!name || !apiKey) return { error: 'name and apiKey required' };
    const acc = addAccount(name, apiKey);
    return { id: acc.id, name: acc.name, createdAt: acc.createdAt };
  });

  fastify.delete('/accounts/:id', async (req) => {
    const id = Number((req.params as any).id);
    removeAccount(id);
    return { ok: true };
  });
}
