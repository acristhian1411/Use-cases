<script>
    import { ArrowLeft, Save } from "lucide-svelte";
    import { enhance } from "$app/forms";
</script>

<div class="max-w-2xl mx-auto space-y-6">
    <div class="flex items-center gap-4">
        <a
            href="/modules"
            class="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
            <ArrowLeft size={20} />
        </a>
        <h1 class="text-2xl font-bold text-white">Create New Module</h1>
    </div>

    <form
        method="POST"
        use:enhance
        class="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-6"
    >
        <div class="space-y-2">
            <label for="name" class="block text-sm font-medium text-slate-300"
                >Module Name</label
            >
            <input
                type="text"
                id="name"
                name="name"
                required
                placeholder="e.g., Authentication, Payment Processing"
                class="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
        </div>

        <div class="space-y-2">
            <label
                for="description"
                class="block text-sm font-medium text-slate-300"
                >Description</label
            >
            <textarea
                id="description"
                name="description"
                rows="4"
                placeholder="Describe the purpose of this module..."
                class="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
            ></textarea>
        </div>

        <div class="flex justify-end pt-4">
            <button
                type="submit"
                class="flex items-center gap-2 px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg font-medium transition-colors shadow-lg shadow-indigo-500/20"
            >
                <Save size={18} />
                <span>Create Module</span>
            </button>
        </div>
    </form>
</div>
