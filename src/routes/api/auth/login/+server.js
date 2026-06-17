import { json } from '@sveltejs/kit';
import { loginWithLaravel } from '$lib/server/externalAuth.js';

export async function POST({ request, cookies }) {
  try {
    const body = /** @type {{ email?: string, password?: string, scope?: string }} */ (await request.json());
    const { email, password, scope } = body;

    if (!email || !password) {
      return json({ error: 'email and password are required' }, { status: 400 });
    }

    const tokenPayload = await loginWithLaravel({ email, password, scope });

    if (tokenPayload.access_token) {
      cookies.set('auth_token', tokenPayload.access_token, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return json(tokenPayload, { status: 200 });
  } catch (error) {
    const err = /** @type {{ status?: number, message?: string }} */ (error);
    const status = err.status || 401;
    return json({ error: err.message || 'Login failed' }, { status });
  }
}
