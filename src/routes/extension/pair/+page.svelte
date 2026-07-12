<script>
	/** @type {{ data: { token: string, userName: string } }} */
	let { data } = $props();
	let paired = $state(false);

	$effect(() => {
		// El content script de pairing (inyectado SOLO en esta URL) escucha este evento
		window.dispatchEvent(
			new CustomEvent('qa-recorder:pair', {
				detail: { token: data.token }
			})
		);

		// La extensión responde confirmando que guardó el token
		const onConfirm = () => (paired = true);
		window.addEventListener('qa-recorder:paired', onConfirm);
		return () => window.removeEventListener('qa-recorder:paired', onConfirm);
	});
</script>

<div class="mx-auto mt-20 max-w-md rounded-lg border border-slate-200 p-6 text-center">
	{#if paired}
		<p class="text-lg font-medium text-green-700">
			✅ Extensión emparejada como {data.userName}
		</p>
		<p class="mt-2 text-sm text-slate-500">Ya podés cerrar esta pestaña.</p>
	{:else}
		<p class="text-lg font-medium">Emparejando extensión…</p>
		<p class="mt-2 text-sm text-slate-500">
			Si esta pantalla no cambia en unos segundos, verificá que la extensión esté instalada y
			habilitada.
		</p>
	{/if}
</div>
