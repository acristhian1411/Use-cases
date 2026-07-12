import { error } from '@sveltejs/kit';
import { randomBytes, createHash } from 'node:crypto';
import { db, ensureDbReady } from '$lib/server/db.js';
import { extensionTokens } from '$lib/server/schema.js';

/**
 * Se asume que hooks.server.js ya validó la sesión Passport y populó
 * event.locals.user (igual que en el resto de tus rutas protegidas).
 */
export const load = async ({ locals }) => {
	if (!locals.user) {
		throw error(401, 'Debés iniciar sesión en la app antes de emparejar la extensión.');
	}

	await ensureDbReady();

	// Token opaco de 32 bytes -> se muestra una sola vez, solo se persiste el hash
	const rawToken = randomBytes(32).toString('hex');
	const tokenHash = createHash('sha256').update(rawToken).digest('hex');

	await db.insert(extensionTokens).values({
		userId: locals.user.id,
		tokenHash,
		label: 'Sin nombrar', // se puede pedir al usuario un nombre en un paso posterior
		createdAt: new Date()
	});

	return {
		token: rawToken,
		userName: locals.user.name
	};
};
