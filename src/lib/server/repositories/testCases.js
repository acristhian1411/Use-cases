import { db } from '../db/index.js';
import { testCases, testSteps, testCaseActors } from '../db/schema.js';
import { eq } from 'drizzle-orm';

export const testCaseRepository = {
  /**
   * @param {number} moduleId
   */
  getAllByModuleId: async (moduleId) => {
    return await db.select().from(testCases).where(eq(testCases.moduleId, moduleId)).all();
  },

  /**
   * @param {number} id
   */
  getById: async (id) => {
    const testCase = await db.select().from(testCases).where(eq(testCases.id, id)).get();
    if (!testCase) return null;

    const steps = await db.select().from(testSteps).where(eq(testSteps.testCaseId, id)).all();
    const actors = await db.select().from(testCaseActors).where(eq(testCaseActors.testCaseId, id)).all();

    return { ...testCase, steps, actors };
  },

  /**
   * @param {Object} data
   */
  create: async (data) => {
    const { steps, actors, ...testCaseData } = data;
    
    const newTestCase = await db.insert(testCases).values(testCaseData).returning().get();
    
    if (steps && steps.length > 0) {
      const stepsWithId = steps.map(/** @param {any} step */ (step) => ({ ...step, testCaseId: newTestCase.id }));
      await db.insert(testSteps).values(stepsWithId).run();
    }

    if (actors && actors.length > 0) {
      const actorsWithId = actors.map(/** @param {any} actor */ (actor) => ({ ...actor, testCaseId: newTestCase.id }));
      await db.insert(testCaseActors).values(actorsWithId).run();
    }

    return newTestCase;
  },

  /**
   * @param {number} id
   * @param {Object} testCaseData
   */
  update: async (id, testCaseData) => {
    const { steps, actors, ...rest } = testCaseData;
    const caseData = { ...rest };
    
    await db.update(testCases).set(caseData).where(eq(testCases.id, id)).run();
    
    await db.delete(testSteps).where(eq(testSteps.testCaseId, id)).run();
    await db.delete(testCaseActors).where(eq(testCaseActors.testCaseId, id)).run();
    
    if (steps && steps.length > 0) {
      const stepsWithId = steps.map(/** @param {any} step */ (step) => ({ ...step, testCaseId: id }));
      await db.insert(testSteps).values(stepsWithId).run();
    }
    
    if (actors && actors.length > 0) {
      const actorsWithId = actors.map(/** @param {any} actor */ (actor) => ({ ...actor, testCaseId: id }));
      await db.insert(testCaseActors).values(actorsWithId).run();
    }
    
    return testCaseRepository.getById(id);
  },

  /**
   * @param {number} id
   */
  delete: async (id) => {
    await db.delete(testSteps).where(eq(testSteps.testCaseId, id)).run();
    await db.delete(testCaseActors).where(eq(testCaseActors.testCaseId, id)).run();
    return await db.delete(testCases).where(eq(testCases.id, id)).returning().get();
  }
};
