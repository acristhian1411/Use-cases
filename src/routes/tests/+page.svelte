<script>
    import { Plus, FlaskConical, ChevronRight, Search } from "lucide-svelte";

    let { data } = $props();
    let searchTerm = $state("");

    let filteredTestCases = $derived(
        data.testCases.filter(
            (tc) =>
                tc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (tc.moduleName &&
                    tc.moduleName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())),
        ),
    );
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold text-white">All Test Cases</h1>
            <p class="text-slate-400 text-sm mt-1">
                Overview of all test cases across modules
            </p>
        </div>
        <a
            href="/tests/new"
            class="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20"
        >
            <Plus size={18} />
            <span>New Test Case</span>
        </a>
    </div>

    <!-- Search -->
    <div class="relative">
        <Search
            size={20}
            class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
        />
        <input
            type="text"
            bind:value={searchTerm}
            placeholder="Search test cases..."
            class="w-full pl-10 pr-4 py-2 bg-slate-900/50 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
        />
    </div>

    <div class="grid gap-3">
        {#each filteredTestCases as testCase}
            <a
                href="/tests/{testCase.id}"
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
                        <div
                            class="flex items-center gap-2 text-sm text-slate-500"
                        >
                            {#if testCase.moduleName}
                                <span
                                    class="px-2 py-0.5 rounded-full bg-slate-800 text-xs"
                                    >{testCase.moduleName}</span
                                >
                            {/if}
                            <span class="line-clamp-1"
                                >{testCase.description ||
                                    "No description"}</span
                            >
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
                <h3 class="text-lg font-medium text-slate-300">
                    No test cases found
                </h3>
                <p class="text-slate-500 mt-1">
                    Try adjusting your search or create a new test case.
                </p>
            </div>
        {/each}
    </div>
</div>
