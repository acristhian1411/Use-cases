// src/routes/api/recordings/start/+server.js
import { json } from '@sveltejs/kit';
import { mkdir } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { db } from '$lib/server/db';
import { recordings } from '$lib/server/schema';
import { requireExtensionAuth } from '$lib/server/auth-extension-token.js';

// Volumen montado en Docker, ej: -v qa_recordings:/app/storage/recordings
const RECORDINGS_DIR = process.env.RECORDINGS_DIR || '/app/storage/recordings';

export async function POST({ request }) {
	const userId = await requireExtensionAuth(request);
	const body = await request.json().catch(() => ({}));
	const { title, refTable, refId } = body; // refTable/refId opcionales, se pueden setear al finalizar

	await mkdir(RECORDINGS_DIR, { recursive: true });

	const now = new Date();
	const fileName = `${randomUUID()}.webm`;
	const [inserted] = await db
		.insert(recordings)
		.values({
			title: title || null,
			status: 'recording',
			filePath: fileName,
			refTable: refTable || null,
			refId: refId || null,
			recordedById: userId,
			createdAt: now
		})
		.returning({ id: recordings.id });

	const recordingId = inserted.id;

	return json({ recordingId, uploadUrl: `/api/recordings/${recordingId}/chunk` });
}
