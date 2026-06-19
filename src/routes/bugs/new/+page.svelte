<script>
  import { ArrowLeft, Save } from "lucide-svelte";
  import { enhance } from "$app/forms";

  let { data } = $props();
  let selectedModuleId = $state(data.selectedModuleId || "");
  let selectedTestCaseId = $state(data.selectedTestCaseId || "");

  let filteredTestCases = $derived(
    data.testCases.filter((testCase) => {
      if (!selectedModuleId) return true;
      return testCase.moduleId === Number(selectedModuleId);
    }),
  );
</script>

<div class="max-w-3xl mx-auto space-y-6 pb-20">
  <div class="flex items-center gap-4">
    <a
      href="/bugs"
      class="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
    >
      <ArrowLeft size={20} />
    </a>
    <h1 class="text-2xl font-bold text-white">Report a Bug</h1>
  </div>

  <form method="POST" use:enhance class="space-y-6">
    <div
      class="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-6"
    >
      <div class="grid gap-6 md:grid-cols-2">
        <div class="space-y-2">
          <label for="title" class="block text-sm font-medium text-slate-300"
            >Title</label
          >
          <input
            id="title"
            name="title"
            type="text"
            required
            placeholder="e.g. Login button does not respond"
            class="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
          />
        </div>
        <div class="space-y-2">
          <label for="severity" class="block text-sm font-medium text-slate-300"
            >Severity</label
          >
          <select
            id="severity"
            name="severity"
            class="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
          >
            <option value="low">Low</option>
            <option value="medium" selected>Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>

      <div class="space-y-2">
        <label
          for="description"
          class="block text-sm font-medium text-slate-300">Description</label
        >
        <textarea
          id="description"
          name="description"
          rows="4"
          required
          placeholder="Describe the unexpected behavior and steps to reproduce"
          class="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all resize-none"
        ></textarea>
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <div class="space-y-2">
          <label for="moduleId" class="block text-sm font-medium text-slate-300"
            >Module</label
          >
          <select
            id="moduleId"
            bind:value={selectedModuleId}
            class="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
          >
            <option value="">All modules</option>
            {#each data.modules as module}
              <option value={module.id}>{module.name}</option>
            {/each}
          </select>
        </div>
        <div class="space-y-2">
          <label
            for="testCaseId"
            class="block text-sm font-medium text-slate-300"
            >Related Test Case</label
          >
          <select
            id="testCaseId"
            name="testCaseId"
            bind:value={selectedTestCaseId}
            class="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
          >
            <option value="">No related case</option>
            {#each filteredTestCases as testCase}
              <option value={testCase.id}>{testCase.title}</option>
            {/each}
          </select>
        </div>
      </div>

      <div class="space-y-2">
        <label for="status" class="block text-sm font-medium text-slate-300"
          >Status</label
        >
        <select
          id="status"
          name="status"
          class="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
        >
          <option value="open" selected>Open</option>
          <option value="in_progress">In Progress</option>
          <option value="fixed">Fixed</option>
          <option value="closed">Closed</option>
        </select>
      </div>
    </div>

    <div class="flex justify-end">
      <button
        type="submit"
        class="flex items-center gap-2 px-8 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-red-500/20"
      >
        <Save size={20} />
        <span>Save Bug</span>
      </button>
    </div>
  </form>
</div>
