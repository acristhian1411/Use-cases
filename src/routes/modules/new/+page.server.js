import { moduleRepository } from '$lib/server/repositories/modules';
import { redirect } from '@sveltejs/kit';

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const name = data.get('name');
    const description = data.get('description');

    if (!name) {
      return { success: false, error: 'Name is required' };
    }

    await moduleRepository.create({ name, description });
    throw redirect(303, '/modules');
  }
};
