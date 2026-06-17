import { redirect } from '@sveltejs/kit';

const publicRoutes = ['/', '/login', '/api/auth/login', '/api/auth/me'];

export async function handle({ event, resolve }) {
  const token = event.cookies.get('auth_token') || event.request.headers.get('authorization');
  const isPublicRoute = publicRoutes.includes(event.url.pathname);

  if (!token && !isPublicRoute) {
    throw redirect(302, '/login');
  }

  return resolve(event);
}
