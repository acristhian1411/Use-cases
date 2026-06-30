import { redirect } from '@sveltejs/kit';
import { getUserFromToken } from '$lib/server/externalAuth.js';
import { userRepository } from '$lib/server/repositories/users.js';
const publicRoutes = ['/', '/login', '/api/auth/login', '/api/auth/me'];

export async function handle({ event, resolve }) {
  const token = event.cookies.get('auth_token') || event.request.headers.get('authorization');
  const isPublicRoute = publicRoutes.includes(event.url.pathname);

  if (!token && !isPublicRoute) {
    throw redirect(302, '/login');
  }
  if (token) {
    const externalUser = await getUserFromToken(token);
    event.locals.user = externalUser ? await resolveLocalUser(externalUser) : null;
  } else {
    event.locals.user = null;
  }

  return resolve(event);
}
/**
 * Garantiza que exista una fila local en `users` para el usuario autenticado
 * externamente, y devuelve el objeto de usuario con el id LOCAL (el que
 * referencian las foreign keys de comments, bugs, etc.).
 * @param {{ id?: unknown, email?: string, name?: string }} externalUser
 */
async function resolveLocalUser(externalUser) {
  if (!externalUser?.email) {
    return null;
  }

  let localUser = await userRepository.getByEmail(externalUser.email);

  if (!localUser) {
    localUser = await userRepository.create({
      name: externalUser.name ?? externalUser.email,
      email: externalUser.email,
      // No se usa para login (eso lo maneja el servicio externo),
      // pero la columna es NOT NULL en el schema actual.
      passwordHash: 'external-auth'
    });
  }

  return {
    ...externalUser,
    id: localUser.id // el id LOCAL, el que coincide con las FKs de SQLite
  };
}