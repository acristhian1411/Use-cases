<script>
    import { ArrowLeft, Save, Plus, Trash2, GripVertical } from "lucide-svelte";
    import { enhance } from "$app/forms";

    /** @type {{ data: { testCase: { title: string, description: string, moduleId: number, preconditions: string, postconditions: string, expectedResult: string, steps: Array<any>, actors: Array<any> }, modules: Array<{ id: number, name: string }> } }} */
    let { data } = $props();

    let steps = $state(data.testCase.steps || []);
    let actors = $state(data.testCase.actors || []);
    let selectedModuleId = $state(data.testCase.moduleId);

    function addStep() {
        steps = [
            ...steps,
            {
                stepNumber: steps.length + 1,
                action: "",
                expected: "",
                type: "normal",
            },
        ];
    }

    /** @param {number} index */
    function removeStep(index) {
        steps = steps
            .filter((_, i) => i !== index)
            .map((step, i) => ({ ...step, stepNumber: i + 1 }));
    }

    function addActor() {
        actors = [...actors, { actorName: "" }];
    }

    /** @param {number} index */
    function removeActor(index) {
        actors = actors.filter((_, i) => i !== index);
    }
</script>

<div class="max-w-4xl mx-auto space-y-6 pb-20">
    <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-4">
            <a
                href={`/modules/${selectedModuleId}`}
                class="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
                <ArrowLeft size={20} />
            </a>
            <h1 class="text-2xl font-bold text-white">Edit Test Case</h1>
        </div>

        <form method="POST" action="?/delete" use:enhance>
            <button
                type="submit"
                class="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg font-medium transition-colors border border-red-500/20"
                onclick={() =>
                    confirm("Are you sure you want to delete this test case?")}
            >
                <Trash2 size={18} />
                <span>Delete</span>
            </button>
        </form>
    </div>

    <form method="POST" action="?/update" use:enhance class="space-y-8">
        <!-- Hidden inputs for JSON data -->
        <input type="hidden" name="steps" value={JSON.stringify(steps)} />
        <input type="hidden" name="actors" value={JSON.stringify(actors)} />

        <!-- Basic Info -->
        <div
            class="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-6"
        >
            <h2
                class="text-lg font-semibold text-slate-200 border-b border-slate-800 pb-2"
            >
                Basic Information
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                    <label
                        for="moduleId"
                        class="block text-sm font-medium text-slate-300"
                        >Module</label
                    >
                    <select
                        id="moduleId"
                        name="moduleId"
                        bind:value={selectedModuleId}
                        required
                        class="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    >
                        <option value="" disabled>Select a module</option>
                        {#each data.modules as module}
                            <option value={module.id}>{module.name}</option>
                        {/each}
                    </select>
                </div>

                <div class="space-y-2">
                    <label
                        for="title"
                        class="block text-sm font-medium text-slate-300"
                        >Test Case Title</label
                    >
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={data.testCase.title}
                        required
                        placeholder="e.g., Login with valid credentials"
                        class="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    />
                </div>
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
                    value={data.testCase.description}
                    rows="2"
                    class="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                ></textarea>
            </div>
        </div>

        <!-- Conditions -->
        <div
            class="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-6"
        >
            <h2
                class="text-lg font-semibold text-slate-200 border-b border-slate-800 pb-2"
            >
                Conditions & Results
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-2">
                    <label
                        for="preconditions"
                        class="block text-sm font-medium text-slate-300"
                        >Preconditions</label
                    >
                    <textarea
                        id="preconditions"
                        name="preconditions"
                        value={data.testCase.preconditions}
                        rows="3"
                        class="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                    ></textarea>
                </div>

                <div class="space-y-2">
                    <label
                        for="postconditions"
                        class="block text-sm font-medium text-slate-300"
                        >Postconditions</label
                    >
                    <textarea
                        id="postconditions"
                        name="postconditions"
                        value={data.testCase.postconditions}
                        rows="3"
                        class="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                    ></textarea>
                </div>
            </div>

            <div class="space-y-2">
                <label
                    for="expectedResult"
                    class="block text-sm font-medium text-slate-300"
                    >Expected Global Result</label
                >
                <textarea
                    id="expectedResult"
                    name="expectedResult"
                    value={data.testCase.expectedResult}
                    rows="2"
                    class="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                ></textarea>
            </div>
        </div>

        <!-- Actors -->
        <div
            class="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-6"
        >
            <div
                class="flex items-center justify-between border-b border-slate-800 pb-2"
            >
                <h2 class="text-lg font-semibold text-slate-200">Actors</h2>
                <button
                    type="button"
                    onclick={addActor}
                    class="text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                >
                    <Plus size={16} /> Add Actor
                </button>
            </div>

            <div class="space-y-3">
                {#each actors as actor, i}
                    <div class="flex gap-3">
                        <input
                            type="text"
                            bind:value={actor.actorName}
                            placeholder="Actor Name (e.g., Admin)"
                            class="flex-1 px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        />
                        <button
                            type="button"
                            onclick={() => removeActor(i)}
                            class="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                {/each}
            </div>
        </div>

        <!-- Steps -->
        <div
            class="bg-slate-900/50 border border-slate-800 rounded-xl p-6 space-y-6"
        >
            <div
                class="flex items-center justify-between border-b border-slate-800 pb-2"
            >
                <h2 class="text-lg font-semibold text-slate-200">Test Steps</h2>
                <button
                    type="button"
                    onclick={addStep}
                    class="text-sm text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1"
                >
                    <Plus size={16} /> Add Step
                </button>
            </div>

            <div class="space-y-4">
                {#each steps as step, i}
                    <div
                        class="flex gap-4 items-start p-4 bg-slate-950/50 rounded-lg border border-slate-800/50 group hover:border-slate-700 transition-colors"
                    >
                        <div class="pt-3 text-slate-600 cursor-move">
                            <GripVertical size={20} />
                        </div>
                        <div class="pt-3 font-mono text-sm text-slate-500 w-6">
                            {step.stepNumber}.
                        </div>
                        <div class="flex-1 space-y-3">
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div class="md:col-span-2">
                                    <input
                                        type="text"
                                        bind:value={step.action}
                                        placeholder="Action"
                                        class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                                    />
                                </div>
                                <div>
                                    <select
                                        bind:value={step.type}
                                        class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                                    >
                                        <option value="normal">Normal</option>
                                        <option value="alternativo"
                                            >Alternative</option
                                        >
                                        <option value="excepcion"
                                            >Exception</option
                                        >
                                    </select>
                                </div>
                            </div>
                            <input
                                type="text"
                                bind:value={step.expected}
                                placeholder="Expected Result"
                                class="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                            />
                        </div>
                        <button
                            type="button"
                            onclick={() => removeStep(i)}
                            class="mt-2 p-2 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                {/each}
            </div>
        </div>

        <div class="flex justify-end pt-4 pb-12">
            <button
                type="submit"
                class="flex items-center gap-2 px-8 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-indigo-500/20 text-lg"
            >
                <Save size={20} />
                <span>Update Test Case</span>
            </button>
        </div>
    </form>
</div>
