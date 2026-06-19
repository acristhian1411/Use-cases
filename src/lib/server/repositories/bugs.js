import { db, ensureDbReady } from '../db/index.js';
import { bugs, testCases, modules } from '../db/schema.js';
import { desc, eq } from 'drizzle-orm';

export const bugRepository = {
  getAll: async () => {
    await ensureDbReady();

    return await db.select({
      id: bugs.id,
      title: bugs.title,
      description: bugs.description,
      severity: bugs.severity,
      status: bugs.status,
      createdAt: bugs.createdAt,
      testCaseId: bugs.testCaseId,
      testCaseTitle: testCases.title,
      moduleName: modules.name
    })
      .from(bugs)
      .leftJoin(testCases, eq(bugs.testCaseId, testCases.id))
      .leftJoin(modules, eq(testCases.moduleId, modules.id))
      .orderBy(desc(bugs.createdAt))
      .all();
  },

  /**
   * @param {{
   *   title: string,
   *   description: string,
   *   severity: string,
   *   status: string,
   *   testCaseId?: number | null,
   *   createdAt: Date
   * }} data
   */
  create: async (data) => {
    await ensureDbReady();

    return await db.insert(bugs).values(data).returning().get();
  },

  /**
   * @param {number} id
   */
  getById: async (id) => {
    await ensureDbReady();

    return await db.select().from(bugs).where(eq(bugs.id, id)).get();
  },

  /**
   * @param {number} id
   * @param {{ title?: string, description?: string, severity?: string, status?: string, testCaseId?: number | null }} data
   */
  update: async (id, data) => {
    await ensureDbReady();

    return await db.update(bugs).set(data).where(eq(bugs.id, id)).returning().get();
  },

  /**
   * @param {number} id
   */
  delete: async (id) => {
    await ensureDbReady();

    return await db.delete(bugs).where(eq(bugs.id, id)).returning().get();
  }
};
