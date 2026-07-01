<script>
  // @ts-nocheck

  import {
    History,
    Plus,
    Pencil,
    Trash2,
    ChevronDown,
    Loader2,
    X,
    Eye,
  } from "lucide-svelte";
  import { onMount } from "svelte";

  /** @type {{ refId: number, refTable: string }} */
  let { refId, refTable } = $props();

  let entries = $state([]);
  let loading = $state(true);
  let expanded = $state(false);
  let selectedEntry = $state(null);

  const COLLAPSED_COUNT = 3;

  const actionMeta = {
    created: {
      icon: Plus,
      color: "text-emerald-400 bg-emerald-500/10",
      label: "creó",
    },
    updated: {
      icon: Pencil,
      color: "text-indigo-400 bg-indigo-500/10",
      label: "actualizó",
    },
    deleted: {
      icon: Trash2,
      color: "text-rose-400 bg-rose-500/10",
      label: "eliminó",
    },
  };

  /** @param {string} action */
  function metaFor(action) {
    return (
      actionMeta[action] ?? {
        icon: History,
        color: "text-slate-400 bg-slate-500/10",
        label: action,
      }
    );
  }

  /** @param {string | Date} date */
  function relativeTime(date) {
    const diffMs = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diffMs / 60000);
    if (minutes < 1) return "recién";
    if (minutes < 60) return `hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `hace ${hours} h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `hace ${days} d`;
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
    });
  }

  /** @param {string | null} details */
  function parsedFields(details) {
    if (!details) return [];
    try {
      const parsed = JSON.parse(details);
      return parsed.fields ?? [];
    } catch {
      return [];
    }
  }

  /** @param {unknown} value */
  function displayValue(value) {
    if (value === null || value === undefined || value === "") return "(vacío)";
    return String(value);
  }

  async function load() {
    loading = true;
    try {
      const res = await fetch(
        `/api/audits?refTable=${encodeURIComponent(refTable)}&refId=${refId}`,
      );
      entries = res.ok ? await res.json() : [];
    } finally {
      loading = false;
    }
  }

  onMount(load);

  const visible = $derived(
    expanded ? entries : entries.slice(0, COLLAPSED_COUNT),
  );
</script>

{#if !loading && entries.length > 0}
  <div class="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-3">
    <div class="flex items-center gap-2 border-b border-slate-800 pb-3">
      <History size={16} class="text-slate-500" />
      <h2 class="text-sm font-semibold text-slate-300">Historial</h2>
      <span class="text-xs text-slate-600">{entries.length}</span>
    </div>

    <div class="space-y-2">
      {#each visible as entry (entry.id)}
        {@const meta = metaFor(entry.action)}
        {@const fields = parsedFields(entry.details)}
        <div class="flex items-center gap-3 text-sm">
          <div
            class="w-6 h-6 rounded-full flex items-center justify-center shrink-0 {meta.color}"
          >
            <meta.icon size={12} />
          </div>
          <span class="text-slate-400">
            <span class="text-slate-300 font-medium"
              >{entry.userName ?? "Alguien"}</span
            >
            {meta.label}
          </span>
          {#if fields.length > 0}
            <button
              type="button"
              onclick={() => (selectedEntry = entry)}
              class="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <Eye size={12} />
              <span
                >{fields.length}
                {fields.length === 1 ? "cambio" : "cambios"}</span
              >
            </button>
          {/if}
          <span class="text-xs text-slate-600 ml-auto shrink-0"
            >{relativeTime(entry.createdAt)}</span
          >
        </div>
      {/each}
    </div>

    {#if entries.length > COLLAPSED_COUNT}
      <button
        type="button"
        onclick={() => (expanded = !expanded)}
        class="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition-colors pt-1"
      >
        <span
          >{expanded
            ? "Ver menos"
            : `Ver ${entries.length - COLLAPSED_COUNT} más`}</span
        >
        <ChevronDown
          size={14}
          class="transition-transform {expanded ? 'rotate-180' : ''}"
        />
      </button>
    {/if}
  </div>
{:else if loading}
  <div class="flex items-center gap-2 text-xs text-slate-600 py-2">
    <Loader2 size={12} class="animate-spin" />
    <span>Cargando historial...</span>
  </div>
{/if}

<!-- Modal de detalles -->
{#if selectedEntry}
  {@const meta = metaFor(selectedEntry.action)}
  {@const fields = parsedFields(selectedEntry.details)}
  <div
    class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    onclick={() => (selectedEntry = null)}
    role="presentation"
  >
    <!-- svelte-ignore a11y_interactive_supports_focus -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <div
      class="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full max-h-[80vh] overflow-hidden flex flex-col"
      onclick={(e) => e.stopPropagation()}
      role="dialog"
      aria-modal="true"
    >
      <div
        class="flex items-center justify-between p-5 border-b border-slate-800"
      >
        <div class="flex items-center gap-2">
          <div
            class="w-7 h-7 rounded-full flex items-center justify-center {meta.color}"
          >
            <meta.icon size={14} />
          </div>
          <div>
            <p class="text-sm font-medium text-slate-200">
              {selectedEntry.userName ?? "Alguien"}
              {meta.label}
            </p>
            <p class="text-xs text-slate-500">
              {relativeTime(selectedEntry.createdAt)}
            </p>
          </div>
        </div>
        <button
          type="button"
          onclick={() => (selectedEntry = null)}
          class="p-1.5 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      <div class="p-5 space-y-3 overflow-y-auto">
        {#each fields as change}
          <div
            class="bg-slate-950/50 border border-slate-800/50 rounded-lg p-3"
          >
            <p class="text-xs font-medium text-slate-400 capitalize mb-2">
              {change.field}
            </p>
            <div class="grid grid-cols-2 gap-2 text-xs">
              <div
                class="bg-rose-500/5 border border-rose-500/10 rounded-md p-2"
              >
                <p class="text-rose-400/70 mb-1">Antes</p>
                <p class="text-slate-300 break-words">
                  {displayValue(change.before)}
                </p>
              </div>
              <div
                class="bg-emerald-500/5 border border-emerald-500/10 rounded-md p-2"
              >
                <p class="text-emerald-400/70 mb-1">Después</p>
                <p class="text-slate-300 break-words">
                  {displayValue(change.after)}
                </p>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
{/if}
