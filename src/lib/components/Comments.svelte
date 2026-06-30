<script>
  import { MessageSquare, Send, Trash2, Loader2 } from "lucide-svelte";
  import { onMount } from "svelte";
  import { authUserStore } from "$lib/stores/auth.js";
  /** @type {{ refId: number, refTable: string, currentUserId?: number | null }} */
  let { refId, refTable } = $props();

  let comments = $state([]);
  let newComment = $state("");
  let loading = $state(true);
  let submitting = $state(false);
  let error = $state("");
  let currentUserId = $derived($authUserStore?.id ?? null);
  async function loadComments() {
    loading = true;
    error = "";
    try {
      const res = await fetch(
        `/api/comments?refTable=${encodeURIComponent(refTable)}&refId=${refId}`,
      );
      if (!res.ok) throw new Error("No se pudieron cargar los comentarios");
      comments = await res.json();
    } catch (err) {
      error = err instanceof Error ? err.message : "Error desconocido";
    } finally {
      loading = false;
    }
  }

  async function addComment() {
    const content = newComment.trim();
    if (!content || submitting) return;

    submitting = true;
    error = "";
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, refTable, refId }),
      });
      if (!res.ok) throw new Error("No se pudo guardar el comentario");
      const created = await res.json();
      comments = [created, ...comments];
      newComment = "";
    } catch (err) {
      error = err instanceof Error ? err.message : "Error desconocido";
    } finally {
      submitting = false;
    }
  }

  /** @param {number} id */
  async function deleteComment(id) {
    const previous = comments;
    comments = comments.filter((c) => c.id !== id);
    try {
      const res = await fetch(`/api/comments?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("No se pudo eliminar el comentario");
    } catch (err) {
      comments = previous;
      error = err instanceof Error ? err.message : "Error desconocido";
    }
  }

  /** @param {string | Date} date */
  function formatDate(date) {
    return new Date(date).toLocaleString("es-ES", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  /** @param {KeyboardEvent} e */
  function handleKeydown(e) {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      addComment();
    }
  }

  onMount(loadComments);
</script>

<div class="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-5">
  <div class="flex items-center gap-2 border-b border-slate-800 pb-3">
    <MessageSquare size={18} class="text-indigo-400" />
    <h2 class="text-lg font-semibold text-slate-200">Comentarios</h2>
    {#if comments.length > 0}
      <span class="text-xs text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full"
        >{comments.length}</span
      >
    {/if}
  </div>

  <div class="flex gap-3">
    <textarea
      bind:value={newComment}
      onkeydown={handleKeydown}
      placeholder="Escribe un comentario... (Ctrl+Enter para enviar)"
      rows="2"
      class="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none text-sm"
    ></textarea>
    <button
      type="button"
      onclick={addComment}
      disabled={submitting || !newComment.trim()}
      class="self-end flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors text-sm shrink-0"
    >
      {#if submitting}
        <Loader2 size={16} class="animate-spin" />
      {:else}
        <Send size={16} />
      {/if}
      <span>Enviar</span>
    </button>
  </div>

  {#if error}
    <p class="text-xs text-rose-400">{error}</p>
  {/if}

  {#if loading}
    <div class="flex items-center gap-2 text-sm text-slate-500 py-4">
      <Loader2 size={16} class="animate-spin" />
      <span>Cargando comentarios...</span>
    </div>
  {:else if comments.length === 0}
    <p class="text-sm text-slate-500 py-2">Todavía no hay comentarios.</p>
  {:else}
    <div class="space-y-3 max-h-96 overflow-y-auto pr-1">
      {#each comments as comment (comment.id)}
        <div
          class="flex gap-3 p-3 bg-slate-950/50 rounded-lg border border-slate-800/50 group"
        >
          <div
            class="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shrink-0"
          >
            {(comment.userName ?? "?").slice(0, 2).toUpperCase()}
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-2">
              <span class="text-sm font-medium text-slate-200"
                >{comment.userName ?? "Usuario eliminado"}</span
              >
              <span class="text-xs text-slate-500 shrink-0"
                >{formatDate(comment.createdAt)}</span
              >
            </div>
            <p
              class="text-sm text-slate-400 mt-1 whitespace-pre-wrap break-words"
            >
              {comment.content}
            </p>
          </div>
          <button
            type="button"
            onclick={() => deleteComment(comment.id)}
            class="p-1.5 h-fit text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={14} />
          </button>
        </div>
      {/each}
    </div>
  {/if}
</div>
