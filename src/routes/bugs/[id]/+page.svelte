<script>
  import { ArrowLeft, Trash2 } from "lucide-svelte";
  import { enhance } from "$app/forms";
  import { page } from "$app/stores";
  import BugForm from "$lib/components/BugForm.svelte";
  import Comments from "$lib/components/Comments.svelte";
  import AuditTrail from "$lib/components/AuditTrail.svelte";
  let { data } = $props();
  let backHref = $derived(
    $page.url.searchParams.get("from") === "bugs"
      ? `/bugs${$page.url.search ? $page.url.search : ""}`
      : "/bugs",
  );
</script>

<div class="max-w-3xl mx-auto space-y-6 pb-20">
  <div class="flex items-center justify-between gap-4">
    <div class="flex items-center gap-4">
      <a
        href={backHref}
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

  <BugForm
    modules={data.modules}
    testCases={data.testCases}
    bug={data.bug}
    action="?/update"
    submitLabel="Save Changes"
  />
  <AuditTrail refId={data.bug.id} refTable="bugs" />
  <Comments refId={data.bug.id} refTable="bugs" />
</div>
