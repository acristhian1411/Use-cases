<script>
    import {
        ArrowLeft,
        Plus,
        FlaskConical,
        ChevronRight,
        Pencil,
        Trash2,
    } from "lucide-svelte";

    let { data } = $props();
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
                <button
                    class="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                >
                    <Pencil size={20} />
                </button>
                <button
                    class="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                    <Trash2 size={20} />
                </button>
            </div>
        </div>
    </div>

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

        <div class="grid gap-3">
            {#each data.testCases as testCase}
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
                            <p class="text-sm text-slate-500 line-clamp-1">
                                {testCase.description || "No description"}
                            </p>
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
