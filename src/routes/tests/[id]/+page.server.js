// @ts-nocheck
import { moduleRepository } from '$lib/server/repositories/modules';
import { testCaseRepository } from '$lib/server/repositories/testCases';
import { error, redirect } from '@sveltejs/kit';
import { logAudit } from '$lib/server/audit.js';

export const load = async ({ params }) => {
  const id = parseInt(params.id);
  const testCase = await testCaseRepository.getById(id);
  const modules = await moduleRepository.getAll();

  if (!testCase) {
    throw error(404, 'Test Case not found');
  }

  return {
    testCase,
    modules
  };
};

export const actions = {
  update: async ({ request, params, locals }) => {
    const id = parseInt(params.id);
    const data = await request.formData();
    
    const title = /** @type {string} */ (data.get('title'));
    const moduleId = parseInt(/** @type {string} */ (data.get('moduleId')));
    const description = /** @type {string} */ (data.get('description'));
    const preconditions = /** @type {string} */ (data.get('preconditions'));
    const postconditions = /** @type {string} */ (data.get('postconditions'));
    const expectedResult = /** @type {string} */ (data.get('expectedResult'));
    const status = /** @type {string} */ (data.get('status')) || 'untested';
    
    const stepsJson = /** @type {string} */ (data.get('steps'));
    const actorsJson = /** @type {string} */ (data.get('actors'));

    if (!title || !moduleId) {
      return { success: false, error: 'Title and Module are required' };
    }

    const steps = stepsJson ? JSON.parse(stepsJson) : [];
    const actors = actorsJson ? JSON.parse(actorsJson) : [];
    let before = await testCaseRepository.getById(id);
    
    await testCaseRepository.update(id, {
      title,
      moduleId,
      description,
      preconditions,
      postconditions,
      expectedResult,
      status,
      steps,
      actors
    });

    await logAudit({
      locals,
      action: 'updated',
      refTable: 'test_cases',
      refId: id,
      before,
      after: {
        title,
        moduleId,
        description,
        preconditions,
        postconditions,
        expectedResult,
        status,
        steps,
        actors
      }
    });

    return { success: true };
  },

  delete: async ({ params, locals }) => {
    const id = parseInt(params.id);
    const testCase = await testCaseRepository.getById(id);
    if (testCase) {
      const before = await testCaseRepository.getById(id);
      await testCaseRepository.delete(id);
      await logAudit({
        locals,
        action: 'deleted',
        refTable: 'test_cases',
        refId: id,
        before,
        after: null
      });

      throw redirect(303, `/modules/${testCase.moduleId}`);
    }
    throw redirect(303, '/modules');
  }
};
