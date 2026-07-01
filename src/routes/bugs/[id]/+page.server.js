import { bugRepository } from '$lib/server/repositories/bugs';
import { redirect, error } from '@sveltejs/kit';
import { logAudit } from '$lib/server/audit.js';

export const load = async ({ params }) => {
  const bug = await bugRepository.getById(parseInt(params.id));

  if (!bug) {
    throw error(404, 'Bug not found');
  }

  return {
    bug
  };
};

export const actions = {
  update: async ({ request, params, locals }) => {
    const id = parseInt(params.id);
    const data = await request.formData();
    const title = /** @type {string} */ (data.get('title'));
    const description = /** @type {string} */ (data.get('description'));
    const severity = /** @type {string} */ (data.get('severity')) || 'medium';
    const status = /** @type {string} */ (data.get('status')) || 'open';

    if (!title || !description) {
      return { success: false, error: 'Title and description are required' };
    }
    const before = await bugRepository.getById(id);
    const changes = {
      title: /** @type {string} */ (data.get('title')),
      description: /** @type {string} */ (data.get('description')),
      severity: /** @type {string} */ (data.get('severity')) || 'medium',
      status: /** @type {string} */ (data.get('status')) || 'open'
    };
    
    await bugRepository.update(id, changes);

    await logAudit({
      locals,
      action: 'updated',
      refTable: 'bugs',
      refId: id,
      before,
      after: changes
    });

    throw redirect(303, '/bugs');
  },

  delete: async ({ params, locals }) => {
    const id = parseInt(params.id);
    await bugRepository.delete(id);
    const before = await bugRepository.getById(id);
    await logAudit({
      locals,
      action: 'deleted',
      refTable: 'bugs',
      refId: id,
      before,
      after: null
    });

    throw redirect(303, '/bugs');
  }
};
