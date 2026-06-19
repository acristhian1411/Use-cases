import { browser } from '$app/environment';
import { writable } from 'svelte/store';

function getInitialUser() {
  if (!browser) {
    return null;
  }

  try {
    const storedUser = localStorage.getItem('auth_user');
    if (!storedUser) {
      return null;
    }

    const parsed = JSON.parse(storedUser);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

export const authUserStore = writable(getInitialUser());

/**
 * @param {Record<string, unknown> | null} user
 */
export function setAuthUser(user) {
  const normalizedUser = user && typeof user === 'object' ? user : null;
  authUserStore.set(normalizedUser);

  if (!browser) {
    return;
  }

  if (normalizedUser) {
    localStorage.setItem('auth_user', JSON.stringify(normalizedUser));
  } else {
    localStorage.removeItem('auth_user');
  }
}

export function clearAuthUser() {
  setAuthUser(null);
}
