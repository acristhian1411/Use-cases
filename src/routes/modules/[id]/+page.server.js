import { moduleRepository } from '$lib/server/repositories/modules';
import { testCaseRepository } from '$lib/server/repositories/testCases';
import { error, redirect } from '@sveltejs/kit';
import { logAudit } from '$lib/server/audit.js';

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

export const actions = {
  delete: async ({ params, locals }) => {
    const id = parseInt(params.id);
    const before = await moduleRepository.getById(id);

    if (!before) {
      throw error(404, 'Module not found');
    }

    try {
      await moduleRepository.delete(id);
    } catch (deleteError) {
      if (
        deleteError instanceof Error &&
        'code' in deleteError &&
        deleteError.code === 'MODULE_HAS_TEST_CASES'
      ) {
        return {
          success: false,
          error: 'Cannot delete this module while it has associated test cases.'
        };
      }

      throw deleteError;
    }

    await logAudit({
      locals,
      action: 'deleted',
      refTable: 'modules',
      refId: id,
      before,
      after: null
    });

    throw redirect(303, '/modules');
  }
};
