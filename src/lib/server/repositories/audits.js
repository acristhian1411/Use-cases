// @ts-nocheck
// src/lib/server/repositories/audits.js
import { db, ensureDbReady } from '../db/index.js';
import { audits, users } from '../db/schema.js';
import { desc, eq, and } from 'drizzle-orm';

export const auditRepository = {
  getByRef: async (refTable, refId) => {
    await ensureDbReady();
    return await db.select({
      id: audits.id,
      action: audits.action,
      userId: audits.userId,
      refTable: audits.refTable,
      refId: audits.refId,
      details: audits.details,
      createdAt: audits.createdAt,
      userName: users.name
    })
      .from(audits)
      .leftJoin(users, eq(audits.userId, users.id))
      .where(and(eq(audits.refTable, refTable), eq(audits.refId, refId)))
      .orderBy(desc(audits.createdAt))
      .all();
  },
  getRecent: async ({ refTable, limit = 50, offset = 0 } = {}) => {
    await ensureDbReady();
    const query = db.select({
      id: audits.id, action: audits.action, userId: audits.userId,
      refTable: audits.refTable, refId: audits.refId, details: audits.details,
      createdAt: audits.createdAt, userName: users.name
    }).from(audits).leftJoin(users, eq(audits.userId, users.id));

    const filtered = refTable ? query.where(eq(audits.refTable, refTable)) : query;
    return await filtered.orderBy(desc(audits.createdAt)).limit(limit).offset(offset).all();
  },
  /**
   * @param {{ action: string, refTable: string, refId: number, userId?: number|null, details?: string|null, createdAt: Date }} data
   */
  create: async (data) => {
    await ensureDbReady();
    return await db.insert(audits).values(data).returning().get();
  }
};