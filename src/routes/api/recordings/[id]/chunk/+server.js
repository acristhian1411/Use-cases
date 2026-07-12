// src/routes/api/recordings/[id]/chunk/+server.js
import { json, error } from '@sveltejs/kit';
import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { recordings } from '$lib/server/schema';
import { requireExtensionAuth } from '$lib/server/auth-extension-token.js';

const RECORDINGS_DIR = process.env.RECORDINGS_DIR || '/app/storage/recordings';

export async function POST({ request, params }) {
	const userId = await requireExtensionAuth(request);
	const recordingId = Number(params.id);

	const [recording] = await db
		.select()
		.from(recordings)
		.where(eq(recordings.id, recordingId))
		.limit(1);

	if (!recording) throw error(404, 'Grabación no encontrada');
	if (recording.recordedById !== userId) throw error(403, 'No autorizado');
	if (recording.status !== 'recording') throw error(409, 'La grabación ya no está activa');

	// El body es el chunk binario crudo (application/octet-stream), no JSON
	const chunk = Buffer.from(await request.arrayBuffer());
	if (!recording.filePath) throw error(409, 'La grabación no tiene archivo asociado');
	await mkdir(RECORDINGS_DIR, { recursive: true });
	const filePath = path.join(RECORDINGS_DIR, recording.filePath);
	await appendFile(filePath, chunk);

	return json({ ok: true, bytesReceived: chunk.length });
}
