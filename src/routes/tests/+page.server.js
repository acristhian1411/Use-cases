import { db } from '$lib/server/db/index.js';
import { testCases, modules } from '$lib/server/db/schema.js';
import { eq, desc } from 'drizzle-orm';

export const load = async () => {
  const allTestCases = await db.select({
    id: testCases.id,
    title: testCases.title,
    description: testCases.description,
    moduleName: modules.name,
    moduleId: modules.id
  })
  .from(testCases)
  .leftJoin(modules, eq(testCases.moduleId, modules.id))
  .orderBy(desc(testCases.id))
  .all();

  return {
    testCases: allTestCases
  };
};
