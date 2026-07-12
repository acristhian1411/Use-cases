// +page.server.js
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { desc, eq } from 'drizzle-orm';
import { db } from '$lib/server/db/index.js';
import { recordings, users } from '$lib/server/db/schema.js';

const DEFAULT_RECORDINGS_DIR = '/app/storage/recordings';
const MAX_LOG_ENTRIES = 300;

function parseSelectedId(maybeId) {
  if (!maybeId) return null;
  const asNumber = Number(maybeId);
  return Number.isInteger(asNumber) && asNumber > 0 ? asNumber : null;
}

async function resolveRecordingsDir() {
  const candidates = [process.env.RECORDINGS_DIR, DEFAULT_RECORDINGS_DIR, path.resolve('storage/recordings')].filter(
    (candidate) => typeof candidate === 'string' && candidate.length > 0
  );

  for (const candidate of candidates) {
    try {
      await access(candidate);
      return candidate;
    } catch {
      // Siguiente opción
    }
  }
  return path.resolve('storage/recordings');
}

async function readJsonl(filePath) {
  if (!filePath) return [];
  const content = await readFile(filePath, 'utf8').catch(() => '');
  if (!content) return [];

  const lines = content.split('\n').filter(Boolean);
  const latestLines = lines.slice(-MAX_LOG_ENTRIES);
  const firstLineNumber = lines.length - latestLines.length;

  return latestLines.map((line, index) => {
    try {
      return JSON.parse(line);
    } catch {
      return {
        type: 'parse_error',
        lineNumber: firstLineNumber + index + 1,
        raw: line
      };
    }
  });
}

export const load = async ({ url }) => {
  const requestedId = parseSelectedId(url.searchParams.get('id'));

  const allRecordings = await db
    .select({
      id: recordings.id,
      title: recordings.title,
      status: recordings.status,
      filePath: recordings.filePath,
      mimeType: recordings.mimeType,
      durationMs: recordings.durationMs,
      fileSizeBytes: recordings.fileSizeBytes,
      consoleLogPath: recordings.consoleLogPath,
      networkLogPath: recordings.networkLogPath,
      refTable: recordings.refTable,
      refId: recordings.refId,
      createdAt: recordings.createdAt,
      finishedAt: recordings.finishedAt,
      recordedById: recordings.recordedById,
      recordedByName: users.name,
      recordedByEmail: users.email
    })
    .from(recordings)
    .leftJoin(users, eq(recordings.recordedById, users.id))
    .orderBy(desc(recordings.id))
    .limit(100)
    .all();

  if (allRecordings.length === 0) {
    return { recordings: [], selectedRecording: null, consoleEntries: [], networkEntries: [] };
  }

  const selectedRecording =
    (requestedId && allRecordings.find((recording) => recording.id === requestedId)) || allRecordings[0];

  const recordingsDir = await resolveRecordingsDir();
  const consoleLogPath = typeof selectedRecording.consoleLogPath === 'string' ? selectedRecording.consoleLogPath : null;
  const networkLogPath = typeof selectedRecording.networkLogPath === 'string' ? selectedRecording.networkLogPath : null;
  
  const consoleEntries = await readJsonl(consoleLogPath ? path.join(recordingsDir, consoleLogPath) : null);
  const networkEntries = await readJsonl(networkLogPath ? path.join(recordingsDir, networkLogPath) : null);

  // NOTA: Ajusta esto según cómo sirvas tus archivos estáticos o multimedia
  // Aquí asumimos un endpoint '/api/assets?file=' o similar
  const videoUrl = selectedRecording.filePath 
    ? `/api/recordings/video/${selectedRecording.id}` 
    : null;

  return {
    recordings: allRecordings,
    selectedRecording: { ...selectedRecording, videoUrl },
    consoleEntries,
    networkEntries
  };
};