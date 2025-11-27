import { db } from '../db/index.js';
import { modules } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const moduleRepository = {
  getAll: async () => {
    return await db.select().from(modules).all();
  },

  getById: async (id) => {
    const result = await db.select().from(modules).where(eq(modules.id, id)).get();
    return result;
  },

  create: async (data) => {
    return await db.insert(modules).values(data).returning().get();
  },

  update: async (id, data) => {
    return await db.update(modules).set(data).where(eq(modules.id, id)).returning().get();
  },

  delete: async (id) => {
    return await db.delete(modules).where(eq(modules.id, id)).returning().get();
  }
};
