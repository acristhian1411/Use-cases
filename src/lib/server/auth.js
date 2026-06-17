import crypto from 'node:crypto';

const SESSION_TTL_MS = 1000 * 60 * 60 * 8;

/**
 * @param {string} password
 */
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.pbkdf2Sync(password, salt, 100_000, 64, 'sha256');
  return `${salt}:${derived.toString('hex')}`;
}

/**
 * @param {string} password
 * @param {string} storedHash
 */
export function verifyPassword(password, storedHash) {
  if (!storedHash || typeof storedHash !== 'string') return false;

  const [salt, hash] = storedHash.split(':');
  if (!salt || !hash) return false;

  const derived = crypto.pbkdf2Sync(password, salt, 100_000, 64, 'sha256');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), derived);
}

export function createSessionToken() {
  return crypto.randomUUID();
}

/**
 * @param {{ id: number, name: string, email: string }} user
 */
export function createSessionRecord(user) {
  return {
    user,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_TTL_MS,
  };
}

/**
 * @param {{ expiresAt: number } | null | undefined} session
 */
export function isSessionValid(session) {
  return Boolean(session) &&
    typeof session === 'object' &&
    session !== null &&
    'expiresAt' in session &&
    typeof session.expiresAt === 'number' &&
    session.expiresAt > Date.now();
}
