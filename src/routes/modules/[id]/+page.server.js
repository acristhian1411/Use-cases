import { moduleRepository } from '$lib/server/repositories/modules';
import { testCaseRepository } from '$lib/server/repositories/testCases';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
  const id = parseInt(params.id);
  const module = await moduleRepository.getById(id);

  if (!module) {
    throw error(404, 'Module not found');
  }

  const testCases = await testCaseRepository.getAllByModuleId(id);

  return {
    module,
    testCases
  };
};
