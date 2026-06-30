import { json } from '@sveltejs/kit';
import { getUserFromToken } from '$lib/server/externalAuth.js';
import { userRepository } from '$lib/server/repositories/users.js';

/**
 * @param {string | null} authorizationHeader
 */
function getBearerToken(authorizationHeader) {
  if (!authorizationHeader || typeof authorizationHeader !== 'string') {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return null;
  }

  return token;
}

export async function GET({ request }) {
  const token = getBearerToken(request.headers.get('authorization'));
  if (!token) {
    return json({ error: 'Missing bearer token' }, { status: 401 });
  }

  try {
    const user = await getUserFromToken(token);

    if (user && user.email) {
      const existing = await userRepository.getByEmail(user.email);
      if (!existing) {
        await userRepository.create({
          name: user.name || 'User',
          email: user.email,
          passwordHash: ''
        });
      }
    }

    return json({ user }, { status: 200 });
  } catch (error) {
    const err = /** @type {{ status?: number, message?: string }} */ (error);
    const status = err.status || 401;
    return json({ error: err.message || 'Unauthorized' }, { status });
  }
}

