import { json } from '@sveltejs/kit';
import { commentRepository } from '$lib/server/repositories/comments.js';

export async function GET({ url }) {
  const refTable = url.searchParams.get('refTable');
  const refId = Number(url.searchParams.get('refId'));

  if (!refTable || !refId) {
    return json({ error: 'refTable y refId son requeridos' }, { status: 400 });
  }

  const result = await commentRepository.getByRef(refTable, refId);
  return json(result);
}

export async function POST({ request, locals }) {
    try {
  const body = await request.json();
  const { content, refTable, refId } = body;

  if (!content?.trim() || !refTable || !refId) {
    return json({ error: 'content, refTable y refId son requeridos' }, { status: 400 });
  }

  const comment = await commentRepository.create({
    content: content.trim(),
    refTable,
    refId: Number(refId),
    userId: locals.user?.id ?? null,
    createdAt: new Date()
  });

  // Para devolver el nombre de usuario sin otra query, lo completamos a mano
  return json({ ...comment, userName: locals.user?.name ?? null }, { status: 201 });
}catch (error) {
  console.log('Error al crear el comentario:', error);
  return json({ error: 'Error al crear el comentario', details: error }, { status: 500 });
}
}

export async function DELETE({ url, locals }) {
  const id = Number(url.searchParams.get('id'));
  if (!id) {
    return json({ error: 'id es requerido' }, { status: 400 });
  }

  const existing = await commentRepository.getById(id);
  if (!existing) {
    return json({ error: 'No encontrado' }, { status: 404 });
  }
  if (existing.userId && locals.user?.id && existing.userId !== locals.user.id) {
    return json({ error: 'No autorizado' }, { status: 403 });
  }

  const deleted = await commentRepository.delete(id);
  return json(deleted);
}