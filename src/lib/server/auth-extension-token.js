import { createHash } from 'node:crypto';
import { error } from '@sveltejs/kit';
import { eq, and, isNull } from 'drizzle-orm';
import { db, ensureDbReady } from '$lib/server/db.js';
import { extensionTokens } from '$lib/server/schema.js';

/**
 * Valida el header `Authorization: Bearer <token>` contra extension_tokens.
 * Devuelve el userId del dueño del token, o lanza 401.
 */
export async function requireExtensionAuth(request) {
	await ensureDbReady();

	const authHeader = request.headers.get('authorization') || '';
	const rawToken = authHeader.replace(/^Bearer\s+/i, '').trim();
	if (!rawToken) throw error(401, 'Falta token de extensión');

	const tokenHash = createHash('sha256').update(rawToken).digest('hex');

	const [row] = await db
		.select()
		.from(extensionTokens)
		.where(and(eq(extensionTokens.tokenHash, tokenHash), isNull(extensionTokens.revokedAt)))
		.limit(1);

	if (!row) throw error(401, 'Token de extensión inválido o revocado');

	// fire-and-forget, no bloquea la respuesta
	db.update(extensionTokens)
		.set({ lastUsedAt: new Date() })
		.where(eq(extensionTokens.id, row.id))
		.run?.();

	return row.userId;
}
