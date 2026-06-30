import { db, ensureDbReady } from '../db/index.js';
import { comments, users } from '../db/schema.js';
import { desc, eq, and } from 'drizzle-orm';

export const commentRepository = {
  /**
   * @param {string} refTable
   * @param {number} refId
   */
  getByRef: async (refTable, refId) => {
    await ensureDbReady();
    return await db.select({
      id: comments.id,
      content: comments.content,
      userId: comments.userId,
      refTable: comments.refTable,
      refId: comments.refId,
      createdAt: comments.createdAt,
      userName: users.name
    })
      .from(comments)
      .leftJoin(users, eq(comments.userId, users.id))
      .where(and(eq(comments.refTable, refTable), eq(comments.refId, refId)))
      .orderBy(desc(comments.createdAt))
      .all();
  },
  /**
   * @param {{ content: string, refTable: string, refId: number, userId?: number | null, createdAt: Date }} data
   */
  create: async (data) => {
    await ensureDbReady();
    return await db.insert(comments).values(data).returning().get();
  },
  /** @param {number} id */
  getById: async (id) => {
    await ensureDbReady();
    return await db.select().from(comments).where(eq(comments.id, id)).get();
  },
  /** @param {number} id */
  delete: async (id) => {
    await ensureDbReady();
    return await db.delete(comments).where(eq(comments.id, id)).returning().get();
  }
};