import { moduleRepository } from '$lib/server/repositories/modules';

export const load = async () => {
  const modules = await moduleRepository.getAll();
  return {
    modules
  };
};
