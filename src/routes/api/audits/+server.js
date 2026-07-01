import { json } from '@sveltejs/kit';
import { auditRepository } from '$lib/server/repositories/audits.js';

export async function GET({ url }) {
  const refTable = url.searchParams.get('refTable');
  const refId = Number(url.searchParams.get('refId'));

  if (!refTable || !refId) {
    return json({ error: 'refTable y refId son requeridos' }, { status: 400 });
  }

  const result = await auditRepository.getByRef(refTable, refId);
  return json(result);
}