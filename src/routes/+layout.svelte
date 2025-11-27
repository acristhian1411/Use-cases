<script>
  import "../app.css";
  import { page } from "$app/stores";
  import { BookOpen, FlaskConical, Home, Settings } from "lucide-svelte";

  let { children } = $props();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/modules", label: "Modules", icon: BookOpen },
    { href: "/tests", label: "Test Cases", icon: FlaskConical },
    // { href: '/settings', label: 'Settings', icon: Settings }
  ];
</script>

<div
  class="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30"
>
  <!-- Sidebar -->
  <aside
    class="fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800/50 backdrop-blur-xl z-50 hidden md:flex flex-col"
  >
    <div class="p-6 border-b border-slate-800/50">
      <h1
        class="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent"
      >
        QA Flow
      </h1>
      <p class="text-xs text-slate-500 mt-1">Manual Testing Registry</p>
    </div>

    <nav class="flex-1 p-4 space-y-1">
      {#each navItems as item}
        {@const isActive =
          $page.url.pathname === item.href ||
          ($page.url.pathname.startsWith(item.href) && item.href !== "/")}
        <a
          href={item.href}
          class="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group {isActive
            ? 'bg-indigo-500/10 text-indigo-400 shadow-lg shadow-indigo-500/5'
            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/50'}"
        >
          <item.icon
            size={20}
            class={isActive
              ? "text-indigo-400"
              : "text-slate-500 group-hover:text-slate-300"}
          />
          <span class="font-medium">{item.label}</span>
          {#if isActive}
            <div
              class="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]"
            ></div>
          {/if}
        </a>
      {/each}
    </nav>

    <div class="p-4 border-t border-slate-800/50">
      <div
        class="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/30 border border-slate-800"
      >
        <div
          class="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white"
        >
          QA
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-slate-200 truncate">Tester</p>
          <p class="text-xs text-slate-500 truncate">Logged In</p>
        </div>
      </div>
    </div>
  </aside>

  <!-- Main Content -->
  <main class="md:ml-64 min-h-screen flex flex-col">
    <!-- Mobile Header -->
    <header
      class="md:hidden h-16 border-b border-slate-800/50 flex items-center px-4 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40"
    >
      <div
        class="font-bold text-lg bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent"
      >
        QA Flow
      </div>
    </header>

    <div class="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
      {@render children()}
    </div>
  </main>
</div>
