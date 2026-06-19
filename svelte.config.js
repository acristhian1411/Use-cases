import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const normalizeOrigin = (entry) => {
  const value = (entry || '').trim();
  if (!value) return '';

  // Accept host:port entries and normalize them to http://host:port
  if (!/^https?:\/\//i.test(value) && /^[^/]+(:\d+)?$/.test(value)) {
    return `http://${value}`;
  }

  return value.replace(/\/$/, '');
};

const parseOrigins = (value) =>
  (value || '')
    .split(',')
    .map(normalizeOrigin)
    .filter(Boolean);

const trustedOrigins = [
  ...parseOrigins(process.env.ORIGIN),
  ...parseOrigins(process.env.PUBLIC_ORIGIN),
  ...parseOrigins(process.env.CSRF_TRUSTED_ORIGINS),
  'http://localhost:81',
  'http://127.0.0.1:81',
  'http://localhost:3000',
  'http://127.0.0.1:3000'
].filter((value, index, array) => array.indexOf(value) === index);

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      out: 'build'
    }),
    csrf: {
      checkOrigin: true,
      trustedOrigins
    }
  }
};

export default config;
