import { moduleRepository } from '$lib/server/repositories/modules';
import { testCaseRepository } from '$lib/server/repositories/testCases';
import { bugRepository } from '$lib/server/repositories/bugs';
import { redirect } from '@sveltejs/kit';

export const load = async ({ url }) => {
  const modules = await moduleRepository.getAll();
  const testCases = await testCaseRepository.getAll();
  const testCaseId = url.searchParams.get('testCaseId');
  const moduleId = url.searchParams.get('moduleId');

  return {
    modules,
    testCases,
    selectedModuleId: moduleId ? parseInt(moduleId) : null,
    selectedTestCaseId: testCaseId ? parseInt(testCaseId) : null
  };
};

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const title = /** @type {string} */ (data.get('title'));
    const description = /** @type {string} */ (data.get('description'));
    const severity = /** @type {string} */ (data.get('severity')) || 'medium';
    const status = /** @type {string} */ (data.get('status')) || 'open';
    const testCaseId = data.get('testCaseId') ? parseInt(/** @type {string} */ (data.get('testCaseId'))) : null;

    if (!title || !description) {
      return { success: false, error: 'Title and description are required' };
    }

    await bugRepository.create({
      title,
      description,
      severity,
      status,
      testCaseId,
      createdAt: new Date()
    });

    throw redirect(303, '/bugs');
  }
};
