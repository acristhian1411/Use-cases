<script>
  import { ArrowLeft } from "lucide-svelte";
  import BugForm from "$lib/components/BugForm.svelte";

  let { data } = $props();
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

  <BugForm modules={data.modules} testCases={data.testCases} />
</div>
