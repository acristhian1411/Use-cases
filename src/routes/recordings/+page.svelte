<script>
  let { data } = $props();
  const { recordings, selectedRecording, consoleEntries, networkEntries } =
    data;

  // Estado para controlar la pestaña activa en el panel lateral (Estilo DevTools)
  let activeTab = $state("network"); // 'network' | 'console'

  function formatDate(value) {
    if (!value) return "N/A";
    return new Date(value).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatBytes(bytes) {
    if (!bytes || bytes <= 0) return "N/A";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }

  function formatDuration(durationMs) {
    if (!durationMs || durationMs <= 0) return "N/A";
    const seconds = Math.round(durationMs / 1000);
    const mins = Math.floor(seconds / 60);
    const rem = seconds % 60;
    return `${mins}m ${rem}s`;
  }
</script>

<div
  class="h-[calc(100vh-4rem)] flex flex-col lg:flex-row gap-4 overflow-hidden text-slate-100 p-2"
>
  <aside
    class="w-full lg:w-64 flex flex-col rounded-xl border border-slate-800/60 bg-slate-900/50 overflow-hidden shrink-0"
  >
    <div
      class="p-3 border-b border-slate-800/60 flex justify-between items-center bg-slate-950/40"
    >
      <h2 class="text-xs font-semibold uppercase tracking-wider text-slate-400">
        Grabaciones
      </h2>
      <span class="text-xs bg-slate-800 px-2 py-0.5 rounded-full"
        >{recordings.length}</span
      >
    </div>
    <div class="flex-1 overflow-y-auto divide-y divide-slate-800/40">
      {#each recordings as recording}
        <a
          href={`/recordings?id=${recording.id}`}
          class={`block p-3 hover:bg-slate-800/30 transition-colors ${selectedRecording?.id === recording.id ? "bg-indigo-500/10 border-l-2 border-indigo-500" : ""}`}
        >
          <p class="text-xs font-medium truncate">
            {recording.title || `Grabación #${recording.id}`}
          </p>
          <p class="text-[10px] text-slate-500 mt-1">
            {formatDate(recording.createdAt)}
          </p>
        </a>
      {/each}
    </div>
  </aside>

  {#if selectedRecording}
    <main
      class="flex-1 flex flex-col min-w-0 bg-slate-950 rounded-xl border border-slate-800/60 overflow-hidden"
    >
      <div
        class="p-4 border-b border-slate-800/60 bg-slate-900/30 flex justify-between items-center"
      >
        <div>
          <h1 class="text-sm font-semibold">
            {selectedRecording.title || `Recording #${selectedRecording.id}`}
          </h1>
          <p class="text-[11px] text-slate-500">
            {formatDuration(selectedRecording.durationMs)} • {formatBytes(
              selectedRecording.fileSizeBytes,
            )}
          </p>
        </div>
      </div>

      <div
        class="flex-1 bg-slate-950 flex items-center justify-center p-4 relative group"
      >
        {#if selectedRecording.videoUrl}
          <video
            src={selectedRecording.videoUrl}
            controls
            class="max-w-full max-h-[60vh] rounded-lg shadow-2xl border border-slate-800"
          ></video>
        {:else}
          <div class="text-center p-6">
            <p class="text-sm text-slate-400">Archivo de video no disponible</p>
          </div>
        {/if}
      </div>
    </main>

    <section
      class="w-full lg:w-[450px] flex flex-col rounded-xl border border-slate-800/60 bg-slate-900/50 overflow-hidden shrink-0"
    >
      <div class="flex border-b border-slate-800/60 bg-slate-950/40 text-xs">
        <button
          class={`flex-1 py-3 font-medium border-b-2 transition-colors ${activeTab === "network" ? "border-indigo-500 text-indigo-400 bg-indigo-500/5" : "border-transparent text-slate-400 hover:text-slate-200"}`}
          onclick={() => (activeTab = "network")}
        >
          Network ({networkEntries.length})
        </button>
        <button
          class={`flex-1 py-3 font-medium border-b-2 transition-colors ${activeTab === "console" ? "border-indigo-500 text-indigo-400 bg-indigo-500/5" : "border-transparent text-slate-400 hover:text-slate-200"}`}
          onclick={() => (activeTab = "console")}
        >
          Console ({consoleEntries.length})
        </button>
      </div>

      <div class="flex-1 overflow-y-auto min-h-0 bg-slate-950/20">
        {#if activeTab === "network"}
          {#if networkEntries.length === 0}
            <p class="p-4 text-xs text-slate-500 text-center">
              No hay eventos de red.
            </p>
          {:else}
            <div class="divide-y divide-slate-800/40 font-mono text-[11px]">
              {#each networkEntries as entry}
                <div class="p-2.5 hover:bg-slate-800/20 flex items-start gap-2">
                  <span
                    class={`px-1.5 py-0.5 rounded text-[10px] uppercase font-bold shrink-0 ${entry.ok === false ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400"}`}
                  >
                    {entry.status || "ERR"}
                  </span>
                  <div class="min-w-0 flex-1">
                    <div class="flex justify-between gap-2 text-slate-400">
                      <span class="text-slate-200 font-semibold"
                        >{entry.method}</span
                      >
                      <span class="truncate text-slate-300" title={entry.url}
                        >{entry.url}</span
                      >
                    </div>
                    <div
                      class="flex justify-between text-[10px] text-slate-500 mt-1"
                    >
                      <span
                        >{entry.durationMs
                          ? `${entry.durationMs}ms`
                          : "-"}</span
                      >
                      <span
                        >{new Date(entry.timestamp).toLocaleTimeString()}</span
                      >
                    </div>
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        {:else if activeTab === "console"}
          {#if consoleEntries.length === 0}
            <p class="p-4 text-xs text-slate-500 text-center">
              No hay eventos de consola.
            </p>
          {:else}
            <div class="divide-y divide-slate-800/40 font-mono text-[11px]">
              {#each consoleEntries as entry}
                <div
                  class={`p-2.5 hover:bg-slate-800/20 border-l-2 ${entry.level === "error" ? "border-rose-500 bg-rose-500/5" : entry.level === "warn" ? "border-amber-500 bg-amber-500/5" : "border-transparent"}`}
                >
                  <div
                    class="flex justify-between text-[10px] text-slate-500 mb-1"
                  >
                    <span class="uppercase font-semibold"
                      >{entry.level || "log"}</span
                    >
                    <span>{new Date(entry.timestamp).toLocaleTimeString()}</span
                    >
                  </div>
                  <p class="text-slate-200 break-all whitespace-pre-wrap">
                    {entry.message || entry.raw || JSON.stringify(entry)}
                  </p>
                </div>
              {/each}
            </div>
          {/if}
        {/if}
      </div>
    </section>
  {:else}
    <div
      class="flex-1 flex items-center justify-center border border-slate-800/50 rounded-xl bg-slate-900/20"
    >
      <p class="text-sm text-slate-500">
        Selecciona una grabación para reproducir
      </p>
    </div>
  {/if}
</div>
