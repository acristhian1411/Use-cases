<script>
  import { goto } from "$app/navigation";
  import { login, getCurrentUser } from "$lib/authClient.js";

  let email = "";
  let password = "";
  let error = "";
  let loading = false;

  /**
   * @param {string} token
   * @param {Record<string, unknown>} user
   */
  function persistSession(token, user) {
    const maxAge = 60 * 60 * 24 * 7;
    document.cookie = `auth_token=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
    document.cookie = `auth_user=${encodeURIComponent(JSON.stringify(user || {}))}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
  }

  async function handleLogin() {
    loading = true;
    error = "";

    try {
      const data = await login(email, password);
      const me = await getCurrentUser(data.access_token);
      persistSession(data.access_token, me.user || {});
      localStorage.setItem("auth_token", data.access_token);
      localStorage.setItem("auth_user", JSON.stringify(me.user || {}));
      await goto("/modules");
    } catch (err) {
      error = err instanceof Error ? err.message : "No se pudo iniciar sesión";
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Login · QA Flow</title>
</svelte:head>

<div
  class="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-12"
>
  <div
    class="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-indigo-950/30"
  >
    <p class="text-sm uppercase tracking-[0.35em] text-indigo-300">
      Auth externa
    </p>
    <h1 class="mt-4 text-3xl font-semibold text-white">Iniciar sesión</h1>
    <p class="mt-2 text-sm text-slate-400">
      Este login usa el servidor Laravel/OAuth externo, como en los ejemplos.
    </p>

    {#if error}
      <p
        class="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200"
      >
        {error}
      </p>
    {/if}

    <form class="mt-6 space-y-4" on:submit|preventDefault={handleLogin}>
      <label class="block text-sm text-slate-200">
        Email
        <input
          bind:value={email}
          type="email"
          required
          class="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-indigo-400"
          placeholder="usuario@empresa.com"
        />
      </label>
      <label class="block text-sm text-slate-200">
        Contraseña
        <input
          bind:value={password}
          type="password"
          required
          class="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-indigo-400"
          placeholder="••••••••"
        />
      </label>
      <button
        disabled={loading}
        class="w-full rounded-xl bg-indigo-500 px-4 py-3 font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
        >{loading ? "Conectando…" : "Entrar con OAuth externo"}</button
      >
    </form>
  </div>
</div>
