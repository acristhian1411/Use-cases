<script>
    import {
        ArrowLeft,
        Plus,
        FlaskConical,
        ChevronRight,
        Pencil,
        Trash2,
    } from "lucide-svelte";
    import { page } from "$app/stores";
    import { enhance } from "$app/forms";

    let { data, form } = $props();
    let selectedStatus = $state($page.url.searchParams.get("status") || "all");
    const statusStyles = {
        untested: "bg-slate-500/10 text-slate-400 border-slate-500/20",
        passed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        failed: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        blocked: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    };

    /** @param {string} status */
    function statusStyle(status) {
        return /** @type {Record<string, string>} */ (statusStyles)[status] || statusStyles.untested;
    }

    /** @param {string} status */
    function statusLabel(status) {
        return status.replace(/_/g, " ");
    }

    /** @param {MouseEvent} event */
    function handleDeleteClick(event) {
        if (data.testCases.length > 0) {
            event.preventDefault();
            alert(
                "This module cannot be deleted while it has associated test cases. Move or delete them first.",
            );
            return;
        }

        if (!confirm("Are you sure you want to delete this module?")) {
            event.preventDefault();
        }
    }

    let filteredTestCases = $derived(
        data.testCases.filter(
            (testCase) =>
                selectedStatus === "all" || testCase.status === selectedStatus,
        ),
    );
</script>

<div class="space-y-8">
    <!-- Header -->
    <div class="space-y-4">
        <div class="flex items-center gap-4">
            <a
                href="/modules"
                class="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
                <ArrowLeft size={20} />
            </a>
            <div class="flex-1">
                <h1 class="text-3xl font-bold text-white">
                    {data.module.name}
                </h1>
                <p class="text-slate-400 mt-1">
                    {data.module.description || "No description provided"}
                </p>
            </div>
            <div class="flex gap-2">
                <a
                    href="/modules/{data.module.id}/edit"
                    class="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                >
                    <Pencil size={20} />
                </a>
                <form method="POST" action="?/delete" use:enhance>
                    <button
                        type="submit"
                        title="Delete module"
                        class="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        onclick={handleDeleteClick}
                    >
                        <Trash2 size={20} />
                    </button>
                </form>
            </div>
        </div>
    </div>
    {#if form?.error}
        <p class="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {form.error}
        </p>
    {/if}
    <!-- Test Cases Section -->
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <h2
                class="text-xl font-semibold text-slate-200 flex items-center gap-2"
            >
                <FlaskConical size={20} class="text-indigo-400" />
                Test Cases
            </h2>
            <a
                href="/tests/new?moduleId={data.module.id}"
                class="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20"
            >
                <Plus size={18} />
                <span>New Test Case</span>
            </a>
        </div>

        <select
            bind:value={selectedStatus}
            aria-label="Filter by status"
            class="w-full px-3 py-2 bg-slate-900/50 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500"
        >
            <option value="all">All statuses</option>
            <option value="untested">Untested</option>
            <option value="passed">Passed</option>
            <option value="failed">Failed</option>
            <option value="blocked">Blocked</option>
        </select>

        <div class="grid gap-3">
            {#each filteredTestCases as testCase}
                <a
                    href={`/tests/${testCase.id}?from=modules/${data.module.id}&status=${selectedStatus}`}
                    class="group flex items-center justify-between p-4 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all duration-200"
                >
                    <div class="flex items-center gap-4">
                        <div
                            class="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors"
                        >
                            <span class="font-mono font-bold text-sm"
                                >#{testCase.id}</span
                            >
                        </div>
                        <div>
                            <h3
                                class="font-medium text-slate-200 group-hover:text-white"
                            >
                                {testCase.title}
                            </h3>
                            <div class="flex items-center gap-2 text-sm text-slate-500">
                                <span
                                    class={`px-2 py-0.5 rounded-full border text-xs capitalize ${statusStyle(testCase.status)}`}
                                    >{statusLabel(testCase.status)}</span
                                >
                                <p class="line-clamp-1">
                                {testCase.description || "No description"}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div
                        class="text-slate-600 group-hover:text-indigo-400 transition-colors"
                    >
                        <ChevronRight size={20} />
                    </div>
                </a>
            {:else}
                <div
                    class="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/20"
                >
                    <div class="p-3 bg-slate-800 rounded-full mb-3">
                        <FlaskConical size={24} class="text-slate-500" />
                    </div>
                    <p class="text-slate-400 font-medium">No test cases yet</p>
                    <p class="text-sm text-slate-600 mt-1">
                        Create a test case to verify this module.
                    </p>
                </div>
            {/each}
        </div>
    </div>
</div>
