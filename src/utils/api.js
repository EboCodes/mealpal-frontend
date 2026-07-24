// Central place for building authenticated requests to the backend.
// Reads the current token from localStorage so every caller stays in sync
// with whatever AuthContext currently has stored, without needing a hook.

export function getToken() {
  try {
    const stored = JSON.parse(localStorage.getItem("user"));
    return stored?.token || null;
  } catch {
    return null;
  }
}

// Wraps fetch and automatically attaches the Authorization header when a
// token is available. Use this for any request to a route that now
// requires verifyToken on the backend.
export async function authFetch(url, options = {}) {
  const token = getToken();
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  return fetch(url, { ...options, headers });
}
