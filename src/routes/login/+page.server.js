import { fail, redirect } from '@sveltejs/kit';
import { db } from '$lib/server/db/index.js';
import { users } from '$lib/server/db/schema.js';
import { eq } from 'drizzle-orm';
import { hashPassword, verifyPassword, createSessionToken, createSessionRecord } from '$lib/server/auth.js';

export const load = async ({ cookies }) => {
  const session = cookies.get('session');
  if (session) {
    throw redirect(302, '/modules');
  }

  return {};
};

export const actions = {
  register: async ({ request, cookies }) => {
    const form = await request.formData();
    const name = String(form.get('name') || '').trim();
    const email = String(form.get('email') || '').trim().toLowerCase();
    const password = String(form.get('password') || '');

    if (!name || !email || !password) {
      return fail(400, { error: 'Todos los campos son obligatorios.' });
    }

    const existing = await db.select().from(users).where(eq(users.email, email)).get();
    if (existing) {
      return fail(400, { error: 'Ese correo ya está registrado.' });
    }

    const passwordHash = hashPassword(password);
    await db.insert(users).values({ name, email, passwordHash, createdAt: new Date() }).run();

    const token = createSessionToken();
    cookies.set('session', token, { path: '/', httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 8 });
    cookies.set('user', JSON.stringify({ id: 0, name, email }), { path: '/', httpOnly: false, sameSite: 'lax', maxAge: 60 * 60 * 8 });

    throw redirect(303, '/modules');
  },

  login: async ({ request, cookies }) => {
    const form = await request.formData();
    const email = String(form.get('email') || '').trim().toLowerCase();
    const password = String(form.get('password') || '');

    if (!email || !password) {
      return fail(400, { error: 'Correo y contraseña son requeridos.' });
    }

    const existing = await db.select().from(users).where(eq(users.email, email)).get();
    if (!existing || !verifyPassword(password, existing.passwordHash)) {
      return fail(401, { error: 'Credenciales inválidas.' });
    }

    const token = createSessionToken();
    const session = createSessionRecord({ id: existing.id, name: existing.name, email: existing.email });
    cookies.set('session', token, { path: '/', httpOnly: true, sameSite: 'lax', maxAge: 60 * 60 * 8 });
    cookies.set('user', JSON.stringify(session.user), { path: '/', httpOnly: false, sameSite: 'lax', maxAge: 60 * 60 * 8 });

    throw redirect(303, '/modules');
  },
};
