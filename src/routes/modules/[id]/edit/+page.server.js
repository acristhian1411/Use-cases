import { moduleRepository } from '$lib/server/repositories/modules';
import { error, redirect } from '@sveltejs/kit';
import { logAudit } from '$lib/server/audit.js';

export const load = async ({ params }) => {
  const module = await moduleRepository.getById(parseInt(params.id));

  if (!module) {
    throw error(404, 'Module not found');
  }

  return { module };
};

export const actions = {
  default: async ({ request, params, locals }) => {
    const id = parseInt(params.id);
    const data = await request.formData();
    const rawName = data.get('name');
    const rawDescription = data.get('description');
    const name = typeof rawName === 'string' ? rawName.trim() : '';
    const description = typeof rawDescription === 'string' ? rawDescription : '';

    if (!name) {
      return { success: false, error: 'Name is required' };
    }

    const before = await moduleRepository.getById(id);
    if (!before) {
      throw error(404, 'Module not found');
    }

    const updated = await moduleRepository.update(id, { name, description });

    await logAudit({
      locals,
      action: 'updated',
      refTable: 'modules',
      refId: id,
      before,
      after: updated
    });

    throw redirect(303, `/modules/${id}`);
  }
};
