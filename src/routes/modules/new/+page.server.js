import { moduleRepository } from '$lib/server/repositories/modules';
import { redirect } from '@sveltejs/kit';
import { logAudit } from '$lib/server/audit.js';

export const actions = {
  default: async ({ request, locals }) => {
    const data = await request.formData();
    const rawName = data.get('name');
    const rawDescription = data.get('description');
    const name = typeof rawName === 'string' ? rawName : '';
    const description = typeof rawDescription === 'string' ? rawDescription : '';

    if (!name) {
      return { success: false, error: 'Name is required' };
    }

    const module = await moduleRepository.create({ name, description });

    await logAudit({
      locals,
      action: 'created',
      refTable: 'modules',
      refId: module.id
    });

    throw redirect(303, '/modules');
  }
};
