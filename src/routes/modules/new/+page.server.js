import { moduleRepository } from '$lib/server/repositories/modules';
import { redirect } from '@sveltejs/kit';

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const rawName = data.get('name');
    const rawDescription = data.get('description');
    const name = typeof rawName === 'string' ? rawName : '';
    const description = typeof rawDescription === 'string' ? rawDescription : '';

    if (!name) {
      return { success: false, error: 'Name is required' };
    }

    await moduleRepository.create({ name, description });
    throw redirect(303, '/modules');
  }
};
