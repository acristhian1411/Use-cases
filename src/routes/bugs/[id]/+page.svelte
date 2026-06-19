<script>
  import { ArrowLeft, Save, Trash2 } from "lucide-svelte";
  import { enhance } from "$app/forms";

  let { data } = $props();
</script>

<div class="max-w-3xl mx-auto space-y-6 pb-20">
  <div class="flex items-center justify-between gap-4">
    <div class="flex items-center gap-4">
      <a
        href="/bugs"
        class="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
      >
        <ArrowLeft size={20} />
      </a>
      <h1 class="text-2xl font-bold text-white">Edit Bug</h1>
    </div>

    <form method="POST" action="?/delete" use:enhance>
      <button
        type="submit"
        class="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg font-medium transition-colors border border-red-500/20"
        onclick={() => confirm("Are you sure you want to delete this bug?")}
      >
        <Trash2 size={18} />
        <span>Delete</span>
      </button>
    </form>
  </div>

  <form method="POST" action="?/update" use:enhance class="space-y-6">
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
            value={data.bug.title}
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
            value={data.bug.severity}
            class="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
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
          value={data.bug.description}
          class="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all resize-none"
        ></textarea>
      </div>

      <div class="space-y-2">
        <label for="status" class="block text-sm font-medium text-slate-300"
          >Status</label
        >
        <select
          id="status"
          name="status"
          value={data.bug.status}
          class="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all"
        >
          <option value="open">Open</option>
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
        <span>Save Changes</span>
      </button>
    </div>
  </form>
</div>
