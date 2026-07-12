// src/routes/api/recordings/[id]/finish/+server.js
import { json, error } from '@sveltejs/kit';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { recordings, audits } from '$lib/server/schema';
import { requireExtensionAuth } from '$lib/server/auth-extension-token.js';

const RECORDINGS_DIR = process.env.RECORDINGS_DIR || '/app/storage/recordings';
const VALID_REF_TABLES = ['test_cases', 'bugs'];

export async function POST({ request, params }) {
	const userId = await requireExtensionAuth(request);
	const recordingId = Number(params.id);
	const body = await request.json().catch(() => ({}));
	const { durationMs, title, refTable, refId } = body;

	const [recording] = await db
		.select()
		.from(recordings)
		.where(eq(recordings.id, recordingId))
		.limit(1);

	if (!recording) throw error(404, 'Grabación no encontrada');
	if (recording.recordedById !== userId) throw error(403, 'No autorizado');

	if (refTable && !VALID_REF_TABLES.includes(refTable)) {
		throw error(400, `refTable inválido: ${refTable}`);
	}

	const filePath = path.join(RECORDINGS_DIR, recording.filePath);
	const stats = await stat(filePath).catch(() => null);

	await db
		.update(recordings)
		.set({
			status: 'completed',
			title: title ?? recording.title,
			refTable: refTable ?? recording.refTable,
			refId: refId ?? recording.refId,
			durationMs: durationMs ?? null,
			fileSizeBytes: stats?.size ?? null,
			finishedAt: new Date()
		})
		.where(eq(recordings.id, recordingId));

	// Deja rastro en el audit trail existente, igual que el resto de tus cambios
	await db.insert(audits).values({
		action: 'recording_created',
		userId,
		refTable: refTable ?? 'recordings',
		refId: refTable ? refId : recordingId,
		details: JSON.stringify({ recordingId }),
		createdAt: new Date()
	});

	return json({ ok: true, recordingId });
}
