<script>
  import { Bug, Plus, Search } from "lucide-svelte";

  let { data } = $props();
  let searchTerm = $state("");
  let selectedStatus = $state("all");
  let selectedSeverity = $state("all");
  let selectedModule = $state("all");

  let filteredBugs = $derived(
    data.bugs.filter((bug) => {
      const matchesSearch =
        bug.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (bug.description || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      const matchesStatus =
        selectedStatus === "all" || bug.status === selectedStatus;
      const matchesSeverity =
        selectedSeverity === "all" || bug.severity === selectedSeverity;
      const matchesModule =
        selectedModule === "all" || bug.moduleName === selectedModule;

      return matchesSearch && matchesStatus && matchesSeverity && matchesModule;
    }),
  );
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold text-white">Bug Reports</h1>
      <p class="text-slate-400 text-sm mt-1">
        Track issues discovered during test execution
      </p>
    </div>
    <a
      href="/bugs/new"
      class="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-red-500/20"
    >
      <Plus size={18} />
      <span>New Bug</span>
    </a>
  </div>

  <div class="grid gap-3 md:grid-cols-4">
    <div class="relative md:col-span-2">
      <Search
        size={18}
        class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
      />
      <input
        type="text"
        bind:value={searchTerm}
        placeholder="Search bugs..."
        class="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
      />
    </div>
    <select
      bind:value={selectedStatus}
      class="px-3 py-2 bg-slate-900/50 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
    >
      <option value="all">All statuses</option>
      <option value="open">Open</option>
      <option value="in_progress">In Progress</option>
      <option value="fixed">Fixed</option>
      <option value="closed">Closed</option>
    </select>
    <select
      bind:value={selectedSeverity}
      class="px-3 py-2 bg-slate-900/50 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-red-500"
    >
      <option value="all">All severities</option>
      <option value="low">Low</option>
      <option value="medium">Medium</option>
      <option value="high">High</option>
      <option value="critical">Critical</option>
    </select>
  </div>

  <div class="grid gap-3">
    {#each filteredBugs as bug}
      <div
        class="p-4 bg-slate-900/50 border border-slate-800 rounded-xl space-y-3"
      >
        <div class="flex items-start justify-between gap-4">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <Bug size={16} class="text-red-400" />
              <h3 class="font-semibold text-slate-200">{bug.title}</h3>
            </div>
            <p class="text-sm text-slate-500">{bug.description}</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              class="px-2 py-1 rounded-full bg-slate-800 text-xs text-slate-300"
              >{bug.status}</span
            >
            <span
              class="px-2 py-1 rounded-full bg-red-500/10 text-red-300 text-xs"
              >{bug.severity}</span
            >
          </div>
        </div>
        <div
          class="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500"
        >
          <div class="flex flex-wrap items-center gap-3">
            {#if bug.testCaseTitle}
              <span>Case: {bug.testCaseTitle}</span>
            {/if}
            {#if bug.moduleName}
              <span>Module: {bug.moduleName}</span>
            {/if}
            <span>Created: {new Date(bug.createdAt).toLocaleDateString()}</span>
          </div>
          <div class="flex items-center gap-2">
            <a
              href={`/bugs/${bug.id}`}
              class="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 transition-colors"
              >Edit</a
            >
            <form method="POST" action={`/bugs/${bug.id}?/delete`}>
              <button
                type="submit"
                class="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                onclick={() =>
                  confirm("Are you sure you want to delete this bug?")}
                >Delete</button
              >
            </form>
          </div>
        </div>
      </div>
    {:else}
      <div
        class="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/20"
      >
        <Bug size={24} class="text-slate-600 mb-3" />
        <p class="text-slate-400 font-medium">No bugs found</p>
        <p class="text-sm text-slate-600 mt-1">
          Report a new issue to start tracking it.
        </p>
      </div>
    {/each}
  </div>
</div>
