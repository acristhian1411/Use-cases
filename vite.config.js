import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			$lib: fileURLToPath(new URL('./lib', import.meta.url))
		}
	},
	test: {
		include: ['src/tests/**/*.test.{js,ts}']
	},
	server: {
		watch: {
			usePolling: true,
			interval: 1000
		},
		hmr: {
			host: 'localhost',
			port: 5173
		}
	}
});
