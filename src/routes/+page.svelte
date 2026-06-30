<script>
  import {
    BookOpen,
    Bug,
    FlaskConical,
    AlertTriangle,
    Clock,
    CheckCircle2,
  } from "lucide-svelte";

  let { data } = $props();

  const {
    stats,
    bugsBySeverity,
    bugsByStatus,
    testCasesByStatus,
    recentBugs,
    modules,
  } = data;

  const severityStyles = {
    critical: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    medium: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  };

  const statusStyles = {
    open: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    in_progress: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    resolved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    closed: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  };

  /** @param {string} value @param {Record<string,string>} map */
  function styleFor(value, map) {
    return map[value] ?? "bg-slate-500/10 text-slate-400 border-slate-500/20";
  }

  /** @param {string} value */
  function label(value) {
    return value.replace(/_/g, " ");
  }

  /** @param {string | Date} date */
  function formatDate(date) {
    return new Date(date).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  const statCards = [
    {
      label: "Módulos",
      value: stats.totalModules,
      icon: BookOpen,
      accent: "from-indigo-500 to-indigo-400",
    },
    {
      label: "Casos de prueba",
      value: stats.totalTestCases,
      icon: FlaskConical,
      accent: "from-cyan-500 to-cyan-400",
    },
    {
      label: "Bugs totales",
      value: stats.totalBugs,
      icon: Bug,
      accent: "from-purple-500 to-purple-400",
    },
    {
      label: "Bugs abiertos",
      value: stats.openBugs,
      icon: AlertTriangle,
      accent: "from-rose-500 to-rose-400",
    },
  ];
</script>

<div class="space-y-8">
  <!-- Header -->
  <div>
    <h1
      class="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent"
    >
      Dashboard
    </h1>
    <p class="text-sm text-slate-500 mt-1">
      Resumen general de tu registro de testing manual
    </p>
  </div>

  <!-- Stat cards -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    {#each statCards as card}
      <div
        class="rounded-xl border border-slate-800/50 bg-slate-900 p-5 hover:border-slate-700/50 transition-colors"
      >
        <div class="flex items-center justify-between">
          <span
            class="text-xs font-medium text-slate-500 uppercase tracking-wide"
            >{card.label}</span
          >
          <div
            class="w-9 h-9 rounded-lg bg-gradient-to-tr {card.accent} flex items-center justify-center shadow-lg"
          >
            <card.icon size={18} class="text-white" />
          </div>
        </div>
        <p class="text-3xl font-bold text-slate-100 mt-3">{card.value}</p>
      </div>
    {/each}
  </div>

  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <!-- Bugs por severidad -->
    <div class="rounded-xl border border-slate-800/50 bg-slate-900 p-6">
      <h2 class="text-sm font-semibold text-slate-200 mb-4">
        Bugs por severidad
      </h2>
      {#if Object.keys(bugsBySeverity).length === 0}
        <p class="text-sm text-slate-500">Todavía no hay bugs registrados.</p>
      {:else}
        <div class="space-y-3">
          {#each Object.entries(bugsBySeverity) as [severity, count]}
            {@const pct = Math.round((count / stats.totalBugs) * 100)}
            <div>
              <div class="flex items-center justify-between text-sm mb-1">
                <span
                  class="capitalize px-2 py-0.5 rounded-md border text-xs {styleFor(
                    severity,
                    severityStyles,
                  )}"
                >
                  {label(severity)}
                </span>
                <span class="text-slate-400">{count}</span>
              </div>
              <div class="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                <div
                  class="h-full rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400"
                  style="width: {pct}%"
                ></div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Bugs por estado -->
    <div class="rounded-xl border border-slate-800/50 bg-slate-900 p-6">
      <h2 class="text-sm font-semibold text-slate-200 mb-4">Bugs por estado</h2>
      {#if Object.keys(bugsByStatus).length === 0}
        <p class="text-sm text-slate-500">Todavía no hay bugs registrados.</p>
      {:else}
        <div class="flex flex-wrap gap-2">
          {#each Object.entries(bugsByStatus) as [status, count]}
            <span
              class="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium {styleFor(
                status,
                statusStyles,
              )}"
            >
              <span class="capitalize">{label(status)}</span>
              <span class="opacity-70">{count}</span>
            </span>
          {/each}
        </div>
      {/if}

      <h2 class="text-sm font-semibold text-slate-200 mt-6 mb-4">
        Casos de prueba por estado
      </h2>
      {#if Object.keys(testCasesByStatus).length === 0}
        <p class="text-sm text-slate-500">Todavía no hay casos de prueba.</p>
      {:else}
        <div class="flex flex-wrap gap-2">
          {#each Object.entries(testCasesByStatus) as [status, count]}
            <span
              class="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium {styleFor(
                status,
                statusStyles,
              )}"
            >
              <span class="capitalize">{label(status)}</span>
              <span class="opacity-70">{count}</span>
            </span>
          {/each}
        </div>
      {/if}
    </div>
  </div>

  <!-- Bugs recientes -->
  <div
    class="rounded-xl border border-slate-800/50 bg-slate-900 overflow-hidden"
  >
    <div
      class="px-6 py-4 border-b border-slate-800/50 flex items-center justify-between"
    >
      <h2 class="text-sm font-semibold text-slate-200">Bugs recientes</h2>
      <a
        href="/bugs"
        class="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
        >Ver todos →</a
      >
    </div>

    {#if recentBugs.length === 0}
      <p class="text-sm text-slate-500 px-6 py-8 text-center">
        No hay bugs registrados todavía.
      </p>
    {:else}
      <div class="divide-y divide-slate-800/50">
        {#each recentBugs as bug}
          <div
            class="px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-800/30 transition-colors"
          >
            <div class="min-w-0">
              <p class="text-sm font-medium text-slate-200 truncate">
                {bug.title}
              </p>
              <p class="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                {#if bug.moduleName}
                  <span>{bug.moduleName}</span>
                  <span class="text-slate-700">•</span>
                {/if}
                <span class="flex items-center gap-1">
                  <Clock size={12} />
                  {formatDate(bug.createdAt)}
                </span>
              </p>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <span
                class="px-2 py-0.5 rounded-md border text-xs capitalize {styleFor(
                  bug.severity,
                  severityStyles,
                )}"
              >
                {label(bug.severity)}
              </span>
              <span
                class="px-2 py-0.5 rounded-md border text-xs capitalize {styleFor(
                  bug.status,
                  statusStyles,
                )}"
              >
                {label(bug.status)}
              </span>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <!-- Módulos -->
  <div class="rounded-xl border border-slate-800/50 bg-slate-900 p-6">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-sm font-semibold text-slate-200">Módulos</h2>
      <a
        href="/modules"
        class="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
        >Ver todos →</a
      >
    </div>
    {#if modules.length === 0}
      <p class="text-sm text-slate-500">Todavía no hay módulos creados.</p>
    {:else}
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {#each modules as mod}
          <a
            href="/modules/{mod.id}"
            class="rounded-lg border border-slate-800 bg-slate-800/30 p-3 hover:border-indigo-500/30 hover:bg-slate-800/60 transition-colors"
          >
            <p class="text-sm font-medium text-slate-200 truncate">
              {mod.name}
            </p>
            {#if mod.description}
              <p class="text-xs text-slate-500 truncate mt-1">
                {mod.description}
              </p>
            {/if}
          </a>
        {/each}
      </div>
    {/if}
  </div>
</div>
