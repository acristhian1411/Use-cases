// src/routes/api/recordings/[id]/logs/+server.js
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
	const { type, entries } = await request.json(); // type: 'console' | 'network'

	const [recording] = await db
		.select()
		.from(recordings)
		.where(eq(recordings.id, recordingId))
		.limit(1);

	if (!recording) throw error(404, 'Grabación no encontrada');
	if (recording.recordedById !== userId) throw error(403, 'No autorizado');

	const logsDir = path.join(RECORDINGS_DIR, 'logs');
	await mkdir(logsDir, { recursive: true });

	const fileName = `${recordingId}-${type}.jsonl`;
	const filePath = path.join(logsDir, fileName);
	const lines = entries.map((e) => JSON.stringify(e)).join('\n') + '\n';
	await appendFile(filePath, lines);

	const columnToUpdate = type === 'console' ? 'consoleLogPath' : 'networkLogPath';
	await db
		.update(recordings)
		.set({ [columnToUpdate]: path.join('logs', fileName) })
		.where(eq(recordings.id, recordingId));

	return json({ ok: true, written: entries.length });
}
