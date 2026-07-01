import { moduleRepository } from '$lib/server/repositories/modules';
import { testCaseRepository } from '$lib/server/repositories/testCases';
import { redirect } from '@sveltejs/kit';
import { logAudit } from '$lib/server/audit.js';

export const load = async ({ url }) => {
  const modules = await moduleRepository.getAll();
  const moduleId = url.searchParams.get('moduleId');
  return {
    modules,
    selectedModuleId: moduleId ? parseInt(moduleId) : null
  };
};

export const actions = {
  default: async ({ request, locals }) => {
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

    const testCase = await testCaseRepository.create({
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
      action: 'created',
      refTable: 'test_cases',
      refId: testCase.id,
      before: null,
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

    throw redirect(303, `/modules/${moduleId}`);
  }
};
