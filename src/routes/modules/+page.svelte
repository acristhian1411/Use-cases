<script>
    import { Plus, Folder, ChevronRight } from "lucide-svelte";

    let { data } = $props();
</script>

<div class="space-y-6">
    <div class="flex items-center justify-between">
        <div>
            <h1 class="text-2xl font-bold text-white">Modules</h1>
            <p class="text-slate-400 text-sm mt-1">
                Manage your system modules and their test cases
            </p>
        </div>
        <a
            href="/modules/new"
            class="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20"
        >
            <Plus size={18} />
            <span>New Module</span>
        </a>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {#each data.modules as module}
            <a
                href="/modules/{module.id}"
                class="group relative p-5 bg-slate-900/50 border border-slate-800 rounded-xl hover:border-indigo-500/50 hover:bg-slate-800/50 transition-all duration-300"
            >
                <div class="flex items-start justify-between mb-4">
                    <div
                        class="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 group-hover:text-indigo-300 group-hover:bg-indigo-500/20 transition-colors"
                    >
                        <Folder size={24} />
                    </div>
                    <div
                        class="text-slate-600 group-hover:text-indigo-400 transition-colors"
                    >
                        <ChevronRight size={20} />
                    </div>
                </div>

                <h3
                    class="text-lg font-semibold text-slate-200 group-hover:text-white mb-2"
                >
                    {module.name}
                </h3>
                <p class="text-sm text-slate-500 line-clamp-2">
                    {module.description || "No description provided"}
                </p>
            </a>
        {:else}
            <div
                class="col-span-full flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-slate-800 rounded-xl"
            >
                <div class="p-4 bg-slate-900 rounded-full mb-4">
                    <Folder size={32} class="text-slate-600" />
                </div>
                <h3 class="text-lg font-medium text-slate-300">
                    No modules found
                </h3>
                <p class="text-slate-500 mt-1 max-w-sm">
                    Get started by creating your first module to organize your
                    test cases.
                </p>
                <a
                    href="/modules/new"
                    class="mt-4 text-indigo-400 hover:text-indigo-300 font-medium"
                >
                    Create Module &rarr;
                </a>
            </div>
        {/each}
    </div>
</div>
