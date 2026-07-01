// src/lib/server/audit.js
import { auditRepository } from './repositories/audits.js';

/**
 * Compara dos objetos plano y devuelve solo los campos que cambiaron.
 * @param {Record<string, unknown> | null | undefined} before
 * @param {Record<string, unknown> | null | undefined} after
 */
function diffFields(before, after) {
  if (!before || !after) return [];
  const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
  const fields = [];

  for (const key of keys) {
    const oldValue = before[key] ?? null;
    const newValue = after[key] ?? null;
    // Comparación simple por string evita falsos positivos con tipos (number vs string)
    if (String(oldValue) !== String(newValue)) {
      fields.push({ field: key, before: oldValue, after: newValue });
    }
  }
  return fields;
}

/**
 * @param {{
 *   locals: App.Locals,
 *   action: 'created' | 'updated' | 'deleted',
 *   refTable: string,
 *   refId: number,
 *   before?: Record<string, unknown> | null,
 *   after?: Record<string, unknown> | null,
 * }} params
 */
export async function logAudit({ locals, action, refTable, refId, before = null, after = null }) {
  try {
    const fields = diffFields(before, after);
    // No guardamos details si no hay cambios reales (ej. un "update" que no tocó nada)
    const details = fields.length > 0 ? JSON.stringify({ fields }) : null;

    await auditRepository.create({
      action,
      userId: locals.user?.id ?? null,
      refTable,
      refId,
      details,
      createdAt: new Date()
    });
  } catch (error) {
    console.warn('No se pudo registrar la auditoría:', error);
  }
}