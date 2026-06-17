import { db } from '../db/index.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const userRepository = {
  /**
   * @param {string} email
   */
  getByEmail: async (email) => {
    return await db.select().from(users).where(eq(users.email, email)).get();
  },

  /**
   * @param {{ name: string, email: string, passwordHash: string }} data
   */
  create: async ({ name, email, passwordHash }) => {
    return await db.insert(users).values({
      name,
      email,
      passwordHash,
      createdAt: new Date(),
    }).returning().get();
  },
};
