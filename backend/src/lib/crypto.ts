import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ALGO = 'aes-256-gcm';

export function encrypt(text: string, key: string): string {
  const k = Buffer.from(key.padEnd(32).slice(0, 32));
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGO, k, iv);
  const enc = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, enc]).toString('base64');
}

export function decrypt(data: string, key: string): string | null {
  try {
    const buf = Buffer.from(data, 'base64');
    const k = Buffer.from(key.padEnd(32).slice(0, 32));
    const iv = buf.subarray(0, 12);
    const tag = buf.subarray(12, 28);
    const enc = buf.subarray(28);
    const decipher = createDecipheriv(ALGO, k, iv);
    decipher.setAuthTag(tag);
    return decipher.update(enc) + decipher.final('utf8');
  } catch {
    return null;
  }
}
