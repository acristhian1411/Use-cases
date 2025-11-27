import { moduleRepository } from '$lib/server/repositories/modules';
import { testCaseRepository } from '$lib/server/repositories/testCases';
import { redirect } from '@sveltejs/kit';

export const load = async ({ url }) => {
  const modules = await moduleRepository.getAll();
  const moduleId = url.searchParams.get('moduleId');
  return {
    modules,
    selectedModuleId: moduleId ? parseInt(moduleId) : null
  };
};

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const title = /** @type {string} */ (data.get('title'));
    const moduleId = parseInt(/** @type {string} */ (data.get('moduleId')));
    const description = /** @type {string} */ (data.get('description'));
    const preconditions = /** @type {string} */ (data.get('preconditions'));
    const postconditions = /** @type {string} */ (data.get('postconditions'));
    const expectedResult = /** @type {string} */ (data.get('expectedResult'));
    
    const stepsJson = /** @type {string} */ (data.get('steps'));
    const actorsJson = /** @type {string} */ (data.get('actors'));

    if (!title || !moduleId) {
      return { success: false, error: 'Title and Module are required' };
    }

    const steps = stepsJson ? JSON.parse(stepsJson) : [];
    const actors = actorsJson ? JSON.parse(actorsJson) : [];

    await testCaseRepository.create({
      title,
      moduleId,
      description,
      preconditions,
      postconditions,
      expectedResult,
      steps,
      actors
    });

    throw redirect(303, `/modules/${moduleId}`);
  }
};
