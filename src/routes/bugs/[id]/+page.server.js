import { bugRepository } from '$lib/server/repositories/bugs';
import { redirect, error } from '@sveltejs/kit';

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
  update: async ({ request, params }) => {
    const id = parseInt(params.id);
    const data = await request.formData();
    const title = /** @type {string} */ (data.get('title'));
    const description = /** @type {string} */ (data.get('description'));
    const severity = /** @type {string} */ (data.get('severity')) || 'medium';
    const status = /** @type {string} */ (data.get('status')) || 'open';

    if (!title || !description) {
      return { success: false, error: 'Title and description are required' };
    }

    await bugRepository.update(id, {
      title,
      description,
      severity,
      status
    });

    throw redirect(303, '/bugs');
  },

  delete: async ({ params }) => {
    await bugRepository.delete(parseInt(params.id));
    throw redirect(303, '/bugs');
  }
};
