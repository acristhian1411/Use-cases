// src/routes/api/recordings/video/[id]/+server.js
import { error } from '@sveltejs/kit';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db/index.js';
import { recordings } from '$lib/server/db/schema.js';

// Reutiliza tu lógica para encontrar el directorio raíz de almacenamiento
const RECORDINGS_DIR = process.env.RECORDINGS_DIR || '/app/storage/recordings';

export const GET = async ({ params }) => {
  const recordingId = Number(params.id);
  if (!recordingId) throw error(400, 'ID inválido');

  // Buscar la grabación en la base de datos
  const [recording] = await db
    .select({ filePath: recordings.filePath, mimeType: recordings.mimeType })
    .from(recordings)
    .where(eq(recordings.id, recordingId))
    .limit(1);

  if (!recording || !recording.filePath) {
    throw error(404, 'Grabación no encontrada');
  }

  const fullPath = path.join(RECORDINGS_DIR, recording.filePath);

  try {
    const fileStat = await stat(fullPath);
    
    // Convertir el archivo local en un stream legible para SvelteKit
    const stream = Readable.toWeb(createReadStream(fullPath));

    // CRUCIAL: Forzar el Content-Type correcto. Si en DB guardas 'video/webm', úsalo.
    const contentType = recording.mimeType || 'video/webm';

    return new Response(stream, {
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileStat.size.toString(),
        // Permite pausar y adelantar el video nativamente en el navegador
        'Accept-Ranges': 'bytes', 
      }
    });
  } catch (err) {
    throw error(404, 'El archivo de video no existe en el disco');
  }
};