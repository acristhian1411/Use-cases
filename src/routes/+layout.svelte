<script>
  import "../app.css";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { BookOpen, FlaskConical, Home, LogOut } from "lucide-svelte";
  import { authUserStore, clearAuthUser } from "$lib/stores/auth.js";
  import { onMount } from "svelte";

  let { children } = $props();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/modules", label: "Modules", icon: BookOpen },
    { href: "/tests", label: "Test Cases", icon: FlaskConical },
  ];

  onMount(() => {
    // Check if user is authenticated on mount
    if (!$authUserStore) {
      goto("/login", { replaceState: true });
    }
  });

  function logout() {
    document.cookie = "auth_token=; Path=/; Max-Age=0; SameSite=Lax";
    document.cookie = "auth_user=; Path=/; Max-Age=0; SameSite=Lax";
    localStorage.removeItem("auth_token");
    clearAuthUser();
    goto("/login", { replaceState: true });
  }

  /**
   * @param {Record<string, unknown> | null} user
   */
  function getDisplayName(user) {
    if (!user) {
      return "Tester";
    }

    if (typeof user.name === "string" && user.name.trim()) {
      return user.name;
    }

    if (typeof user.email === "string" && user.email.trim()) {
      return user.email;
    }

    return "Tester";
  }

  /**
   * @param {Record<string, unknown> | null} user
   */
  function getInitials(user) {
    const name = getDisplayName(user);
    const parts = name.split(/\s+/).filter(Boolean);

    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }

    return name.slice(0, 2).toUpperCase();
  }
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

    <div class="p-4 border-t border-slate-800/50 space-y-2">
      <button
        type="button"
        onclick={logout}
        class="flex w-full items-center gap-3 rounded-xl border border-slate-800 bg-slate-800/30 px-4 py-3 text-sm text-slate-200 transition hover:bg-slate-800 hover:text-white"
      >
        <LogOut size={18} class="text-slate-400" />
        <span>Logout</span>
      </button>

      <div
        class="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/30 border border-slate-800"
      >
        <div
          class="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white"
        >
          {$authUserStore ? getInitials($authUserStore) : "QA"}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-slate-200 truncate">
            {$authUserStore ? getDisplayName($authUserStore) : "Tester"}
          </p>
          <p class="text-xs text-slate-500 truncate">
            {$authUserStore ? "Logged In" : "No session"}
          </p>
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
