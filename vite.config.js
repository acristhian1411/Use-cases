import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
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
