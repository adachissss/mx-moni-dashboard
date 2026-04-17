import path from 'path';
import { randomBytes } from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
if (!ENCRYPTION_KEY) {
  const key = randomBytes(32).toString('hex');
  console.warn('[config] ENCRYPTION_KEY not set, generated:', key);
}

export const CONFIG = {
  port: Number(process.env.PORT ?? 3001),
  dataDir: process.env.DATA_DIR ?? path.resolve(__dirname, '../../data'),
  encryptionKey: ENCRYPTION_KEY ?? randomBytes(32).toString('hex'),
  cors: {
    origin: true,
    credentials: true,
  },
};
