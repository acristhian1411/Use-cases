import { bugRepository } from '$lib/server/repositories/bugs';
import { moduleRepository } from '$lib/server/repositories/modules';

export const load = async () => {
  const bugs = await bugRepository.getAll();
  const modules = await moduleRepository.getAll();

  return {
    bugs,
    modules
  };
};
