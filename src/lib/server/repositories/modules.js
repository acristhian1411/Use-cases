import { db } from '../db/index.js';
import { modules, testCases } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const moduleRepository = {
  getAll: async () => {
    return await db.select().from(modules).all();
  },

  /**
   * @param {number} id
   */
  getById: async (id) => {
    const result = await db.select().from(modules).where(eq(modules.id, id)).get();
    return result;
  },

  /**
   * @param {{ name: string, description?: string | null }} data
   */
  create: async (data) => {
    return await db.insert(modules).values(data).returning().get();
  },

  /**
   * @param {number} id
   * @param {{ name?: string, description?: string | null }} data
   */
  update: async (id, data) => {
    return await db.update(modules).set(data).where(eq(modules.id, id)).returning().get();
  },

  /**
   * @param {number} id
   */
  delete: async (id) => {
    const relatedTestCases = await db.select({ id: testCases.id })
      .from(testCases)
      .where(eq(testCases.moduleId, id))
      .all();

    if (relatedTestCases.length > 0) {
      throw Object.assign(
        new Error('Cannot delete a module with associated test cases'),
        { code: 'MODULE_HAS_TEST_CASES' },
      );
    }

    return await db.delete(modules).where(eq(modules.id, id)).returning().get();
  }
};
